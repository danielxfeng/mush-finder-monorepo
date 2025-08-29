import { type HashTask, HashTaskSchema, type TaskBody, TaskBodySchema, z } from '@repo/schemas';
import axios, { AxiosError, type AxiosInstance, type AxiosResponse } from 'axios';

import {
  API_KEY,
  API_URL,
  CLOUDINARY_PRESET,
  CLOUDINARY_URL,
  MAX_RETRY,
} from '@/constants/constants';
import { taskWithTimeout } from '@/lib/timeout-util';

//
// Upload image to Cloudinary
//

const cloudinaryApi: AxiosInstance = axios.create({
  baseURL: CLOUDINARY_URL,
  timeout: 10000, // 10 seconds
});

const uploadImg = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_PRESET);

  const response = await cloudinaryApi.post('/image/upload', formData);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return response.data.secure_url as string;
};

//
// Online inference
//

const gatewayApi: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 5000, // 5 seconds
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': API_KEY,
  },
});

const newTaskService = async (task: TaskBody): Promise<AxiosResponse<HashTask>> => {
  return await gatewayApi.post('/task', task);
};

const getTaskService = async (hashTask: HashTask): Promise<AxiosResponse<HashTask>> => {
  return await gatewayApi.get(`/task/${hashTask.p_hash}`);
};

const waitForNext = async (retry: number): Promise<void> => {
  const delay = Math.max(3000, retry * 1000);
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

// Get result with auto-retry
const getInferenceResultWithoutTimeout = async (
  hashTask: HashTask,
  signal?: AbortSignal,
): Promise<HashTask> => {
  let task = hashTask;
  let retry = 0;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  while (true) {
    if (signal?.aborted)
      throw new Error(`Aborted by signal: hash: ${task.p_hash}, status: ${task.status}`);

    if (task.status === 'done' || task.status === 'not_found') return task;
    const isError = task.status === 'error' && task.retry_count >= MAX_RETRY;
    if (isError) return task;

    await waitForNext(retry);
    retry++;

    try {
      const res = await getTaskService(task);
      const validated = HashTaskSchema.safeParse(res.data);
      if (!validated.success)
        throw new Error(`Invalid response data: ${z.prettifyError(validated.error)}`);

      task = validated.data;
      continue;
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status && status >= 400 && status < 500) {
          throw error;
        } else {
          // Sentry.captureException(error);
          continue;
        }
      }
      throw error;
    }
  }
};

const getInferenceResult = async (hashTask: HashTask): Promise<HashTask> => {
  return await taskWithTimeout(
    (signal) => getInferenceResultWithoutTimeout(hashTask, signal),
    3 * 60000, // 3 minutes
  );
};

const onlineInference = async (hash: string, file: File): Promise<HashTask> => {
  // Prepare a new task.
  const imgUrl = await uploadImg(file);

  const task: TaskBody = { p_hash: hash, img_url: imgUrl };
  const validatedTask = TaskBodySchema.safeParse(task);
  if (!validatedTask.success)
    throw new Error(`Invalid task body: ${z.prettifyError(validatedTask.error)}`);

  // Create a new task
  const res = await newTaskService(validatedTask.data);
  const validatedResponse = HashTaskSchema.safeParse(res.data);
  if (!validatedResponse.success)
    throw new Error(`Invalid response data: ${z.prettifyError(validatedResponse.error)}`);

  // Check result
  return await getInferenceResult(validatedResponse.data);
};

export { onlineInference };
