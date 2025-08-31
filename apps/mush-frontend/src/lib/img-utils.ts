import { taskWithTimeout } from '@/lib/timeout-util';

const IMG_SIZE = 224;

const resizeImgWithoutTimeout = async (file: File): Promise<File> => {
  const bitmap = await createImageBitmap(file);

  if (typeof OffscreenCanvas === 'undefined') throw new Error('OffscreenCanvas is not supported');
  const canvas: OffscreenCanvas = new OffscreenCanvas(IMG_SIZE, IMG_SIZE);

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No canvas context');

  const size = Math.min(bitmap.width, bitmap.height);
  const sx = (bitmap.width - size) / 2;
  const sy = (bitmap.height - size) / 2;
  ctx.drawImage(bitmap, sx, sy, size, size, 0, 0, IMG_SIZE, IMG_SIZE);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  bitmap.close?.();

  const blob = await canvas.convertToBlob({ type: 'image/png' });
  return new File([blob], file.name.replace(/\.[^.]+$/, '.png'), { type: blob.type });
};

const resizeImg = async (file: File): Promise<File> => {
  // imageFileResizer doesn't return on error.
  return await taskWithTimeout(resizeImgWithoutTimeout(file), 10000); // 10 seconds
};

const generateHash = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

export { generateHash, resizeImg };
