import { zodResolver } from '@hookform/resolvers/zod';
import {
  type FileUpload,
  FileUploadSchema,
  HashTaskSchema,
  type HistoryDb,
  z,
} from '@repo/schemas';
import { useForm } from 'react-hook-form';

import { generateHash, resizeImg } from '@/lib/img-utils';
import { putAndGetHistoryDb } from '@/lib/indexed-db-helper';
import InferenceEngineFactory from '@/lib/inference-engine/inference-interface';
import useAppModeStore from '@/lib/stores/app-mode-store';

import useHistoryStore from '../stores/history-store';

const useUploadForm = () => {
  const mode = useAppModeStore((state) => state.mode);
  const updateHistory = useHistoryStore.getState().updateHistory;

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
      const history = await putAndGetHistoryDb(newItem);
      updateHistory(history);

      return validated.data;
    } catch {
      // Sentry.captureException(error);
      return null;
    }
  };

  return { ...form, onSubmit };
};

export default useUploadForm;
