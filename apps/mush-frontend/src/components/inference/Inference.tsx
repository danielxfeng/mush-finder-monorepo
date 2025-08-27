import type { FileUpload, TaskResponse } from '@repo/schemas';
import { CloudUpload, Upload } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { type ControllerRenderProps } from 'react-hook-form';

import ResultCard from '@/components/shared/ResultCard';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import useUploadForm from '@/lib/hooks/useUploadForm';
import useAppModeStore from '@/lib/stores/app-mode-store';
import { cn } from '@/lib/utils';

interface UploadZoneProps {
  field: ControllerRenderProps<{ img: File }, 'img'>;
  setPreview: (url: string | null) => void;
}

const UploadZone = ({ field, setPreview }: UploadZoneProps) => {
  const mode = useAppModeStore((state) => state.mode);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      field.onChange(acceptedFiles[0]);
      const url = URL.createObjectURL(acceptedFiles[0]);
      setPreview(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    },
    [field, setPreview],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'lg:border-muted-foreground flex w-full max-w-2xl cursor-pointer flex-col items-center justify-center rounded-lg lg:border lg:border-dashed lg:py-10',
        isDragActive && 'bg-muted/50 border-primary/50',
      )}
    >
      <input {...getInputProps()} />
      {mode === 'online' ? <CloudUpload className='h-12 w-12' /> : <Upload className='h-12 w-12' />}
      <p className='text-muted-foreground text-xs'>
        {isDragActive
          ? 'Drop the picture here ...'
          : 'Drag & drop a picture here, or click to select a picture'}
      </p>
    </div>
  );
};

const Inference = () => {
  const [result, setResult] = useState<TaskResponse | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const form = useUploadForm();

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleValidSubmit = (data: FileUpload): void => {
    void (async () => {
      const res = await form.onSubmit(data);
      setResult(res);
    })();
  };

  return (
    <div data-role='inference-form' className='w-full max-w-4xl px-4'>
      <Form {...form}>
        <form
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={form.handleSubmit(handleValidSubmit)}
          className='flex w-full flex-col items-center justify-center space-y-8'
        >
          <FormField
            name='img'
            control={form.control}
            render={({ field }) => (
              <FormItem className='flex w-full flex-col items-center'>
                <FormControl>
                  <UploadZone field={field} setPreview={setPreview} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div
            data-role='preview-and-submit'
            className='flex flex-col items-center justify-center gap-4 lg:flex-row lg:justify-between'
          >
            <div>
              {preview && <img src={preview} alt='Preview' className='max-h-20 max-w-20' />}
            </div>
            <Button type='submit' disabled={form.formState.isSubmitting || !form.formState.isValid}>
              Submit
            </Button>
          </div>
        </form>
      </Form>

      <ResultCard result={result} setResult={setResult} />
    </div>
  );
};

export default Inference;
