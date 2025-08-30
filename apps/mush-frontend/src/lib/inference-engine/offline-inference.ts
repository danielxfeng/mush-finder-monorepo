import { type HashTask, HashTaskSchema, type TaskResponse, z } from '@repo/schemas';
import type { AxiosInstance } from 'axios';
import axios from 'axios';
import type { InferenceSession } from 'onnxruntime-web';

import { EDGE_MODEL_URL, MUSH } from '@/constants/constants';
import { getModelDb } from '@/lib/indexed-db-helper';
import { softmax } from '@/lib/math-utils';

const K = 3;
const IMG_SIZE = 224;

//
// Model download
//

const modelDownloadApi: AxiosInstance = axios.create({
  baseURL: EDGE_MODEL_URL,
  timeout: 200000, // 200 seconds
});

const downloadEdgeModel = async (): Promise<Blob> => {
  const response = await modelDownloadApi.get('', {
    responseType: 'blob',
  });
  return response.data as Blob;
};

//
// Inference
//

let session: InferenceSession | null = null;

const offlineInference = async (hash: string, file: File): Promise<HashTask> => {
  const blob = await getModelDb();
  if (!blob) throw new Error('Model blob not found');

  const ort = await import('onnxruntime-web');
  const buf = await blob.arrayBuffer();

  // Load model
  const model = (session ??= await ort.InferenceSession.create(buf));

  // Preprocess image: create a canvas
  const canvas: OffscreenCanvas | HTMLCanvasElement =
    typeof OffscreenCanvas !== 'undefined'
      ? new OffscreenCanvas(IMG_SIZE, IMG_SIZE)
      : (() => {
          const c = document.createElement('canvas');
          c.width = IMG_SIZE;
          c.height = IMG_SIZE;
          return c;
        })();

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');
  const bitmap = await createImageBitmap(file);
  ctx.drawImage(bitmap, 0, 0, IMG_SIZE, IMG_SIZE);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  bitmap.close?.();

  // Preprocess image: remove alpha channel, and normalize
  const imgData = ctx.getImageData(0, 0, IMG_SIZE, IMG_SIZE).data; // Uint8ClampedArray [R,G,B,A,R,G,B,A,...]

  const input = new Float32Array(1 * 3 * IMG_SIZE * IMG_SIZE); // NCHW

  const MEAN = [0.485, 0.456, 0.406];
  const STD = [0.229, 0.224, 0.225];

  for (let y = 0; y < IMG_SIZE; y++) {
    for (let x = 0; x < IMG_SIZE; x++) {
      const i = (y * IMG_SIZE + x) * 4;
      const r = imgData[i] / 255;
      const g = imgData[i + 1] / 255;
      const b = imgData[i + 2] / 255;

      const rr = (r - MEAN[0]) / STD[0];
      const gg = (g - MEAN[1]) / STD[1];
      const bb = (b - MEAN[2]) / STD[2];

      const base = y * IMG_SIZE + x;
      input[0 * IMG_SIZE * IMG_SIZE + base] = rr;
      input[1 * IMG_SIZE * IMG_SIZE + base] = gg;
      input[2 * IMG_SIZE * IMG_SIZE + base] = bb;
    }
  }

  // 1 batch, 3 channels, 224x224 pixels
  const inputTensor = new ort.Tensor('float32', input, [1, 3, IMG_SIZE, IMG_SIZE]);

  // Inference
  const feeds = { [model.inputNames[0]]: inputTensor };
  const results = await model.run(feeds);
  const output = results[model.outputNames[0]];

  const data = output.data as Float32Array;
  if (!data.length) throw new Error('Empty model output');

  // Post-Processing
  const topK = softmax(Array.from(data))
    .map((v, i) => ({ index: i, value: v }))
    .sort((a, b) => b.value - a.value)
    .slice(0, Math.min(K, MUSH.length));

  const taskResponse: TaskResponse = {
    p_hash: hash,
    status: 'done',
    result: topK.map((item) => ({
      category: MUSH[item.index].className,
      confidence: item.value,
    })),
  };

  const hashTask: HashTask = {
    processed_at: 0,
    retry_count: 0,
    img_url: 'https://localhost/image.jpg',
    ...taskResponse,
  };
  const validatedResponse = HashTaskSchema.safeParse(hashTask);
  if (!validatedResponse.success)
    throw new Error(`Invalid hash task: ${z.prettifyError(validatedResponse.error)}`);

  return validatedResponse.data;
};

export { downloadEdgeModel, offlineInference };
