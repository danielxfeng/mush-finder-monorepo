import { imageFileResizer } from '@peacechen/react-image-file-resizer';

const resizeImgWithoutTimeout = async (file: File): Promise<File> => {
  const newImage = await imageFileResizer({
    file,
    maxHeight: 224,
    maxWidth: 224,
    minHeight: 224,
    minWidth: 224,
    outputType: 'file',
    quality: 0.9,
    rotation: 0,
  });
  return newImage as File;
};

const resizeImg = async (file: File): Promise<File> => {
  // imageFileResizer doesn't return on error.
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error('Image resize timed out'));
    }, 10000); // 10 seconds
  });

  return Promise.race([timeout, resizeImgWithoutTimeout(file)]);
};

const generateHash = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

export { generateHash, resizeImg };
