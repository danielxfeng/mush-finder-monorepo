import { zodResolver } from '@hookform/resolvers/zod';
import { type FileUpload, FileUploadSchema, HashTaskSchema, z } from '@repo/schemas';
import { useForm } from 'react-hook-form';

import useAppModeStore from '@/lib/stores/app-mode-store';

const useUploadForm = () => {
  const mode = useAppModeStore((state) => state.mode);

  const form = useForm<FileUpload>({
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    resolver: zodResolver(FileUploadSchema),
  });

  const onSubmit = async (data: FileUpload) => {
    try {
      const convertedImg = convertImg(data.img);
      const pHash = getImageHash(convertedImg);

      const hashTask =
        mode === 'offline'
          ? offlineInference(pHash, convertedImg)
          : onlineInference(pHash, convertedImg);

      const validated = HashTaskSchema.safeParse(hashTask);
      if (!validated.success)
        throw new Error(`Invalid result: ${z.prettifyError(validated.error)}`);

      addToHistory({ pHash, mode, img: convertedImg, taskResponse: validated.data });
      return validated.data;
    } catch (error) {
      // Sentry.captureException(error);
      return null;
    }
  };

  return { ...form, onSubmit };
};

export default useUploadForm;
