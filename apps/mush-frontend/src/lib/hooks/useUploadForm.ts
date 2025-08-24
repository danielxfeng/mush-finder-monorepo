import { zodResolver } from '@hookform/resolvers/zod';
import {
  type FileUpload,
  FileUploadSchema,
  HashTaskSchema,
  type HistoryDb,
  z,
} from '@repo/schemas';
import { useForm } from 'react-hook-form';

import useAppModeStore from '@/lib/stores/app-mode-store';

import { generateHash, resizeImg } from '../img-utils';
import { putAndGetHistoryDb } from '../indexed-db-helper';
import InferenceEngineFactory from '../inference-engine/inference-interface';

const useUploadForm = () => {
  const mode = useAppModeStore((state) => state.mode);

  const form = useForm<FileUpload>({
    resolver: zodResolver(FileUploadSchema),
  });

  const onSubmit = async (data: FileUpload) => {
    try {
      // Resize and hash the image
      const resizedImg = await resizeImg(data.img);
      const pHash = await generateHash(resizedImg);

      // Perform inference
      const inferenceEngine = InferenceEngineFactory(mode);
      const hashTask = await inferenceEngine(pHash, resizedImg);
      const validated = HashTaskSchema.safeParse(hashTask);
      if (!validated.success)
        throw new Error(`Invalid result: ${z.prettifyError(validated.error)}`);
      if (validated.data.status === 'error') throw new Error('Error processing image.');

      // Save to history
      const newItem: HistoryDb = {
        p_hash: pHash,
        mode,
        img: resizedImg,
        taskResponse: validated.data,
        createdAt: new Date(),
      };
      await putAndGetHistoryDb(newItem);
      // TODO: add to store

      return validated.data;
    } catch {
      // Sentry.captureException(error);
      return null;
    }
  };

  return { ...form, onSubmit };
};

export default useUploadForm;
