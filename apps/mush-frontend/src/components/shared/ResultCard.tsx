import type { TaskResponse } from '@repo/schemas';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { MUSH } from '@/constants/constants';
import useOutsideClick from '@/lib/hooks/useOutsideClick';
import { deleteFromHistoryDb } from '@/lib/indexed-db-helper';
import { cn } from '@/lib/utils';

interface ResultCardProps {
  result: TaskResponse | null;
  setResult: (v: TaskResponse | null) => void;
  dbKey?: string;
}

const ResultCard = ({ result, setResult, dbKey }: ResultCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { clickOutside, resetClickOutside } = useOutsideClick(ref);
  const removeFromHistory = async (key: string) => {
    try {
      await deleteFromHistoryDb(key);
    } catch {
      // Sentry.captureException(error);
      toast.error('Failed to remove from history');
    } finally {
      setResult(null);
    }
  };

  useEffect(() => {
    if (clickOutside) {
      resetClickOutside(false);
      setResult(null);
    }
  }, [clickOutside, resetClickOutside, setResult]);

  return (
    <AnimatePresence>
      {result && (
        <motion.div
          key='result-card'
          ref={ref}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.2 }}
          transition={{ duration: 0.7 }}
          data-set='task-result'
          className={cn(
            'border-foreground relative flex w-full flex-col items-center justify-center gap-2 rounded-xl border p-4 lg:w-fit',
            dbKey &&
              'bg-background/75 button absolute bottom-0 left-1/2 z-20 -translate-x-1/2 backdrop-blur-md',
          )}
        >
          <h4 className='my-4'>The Inference Result:</h4>
          <div
            data-set='task-result-content'
            className='divide-border lg:divide-x-1 divide-y-1 flex flex-col items-center justify-center divide-x-0 lg:flex-row lg:divide-y-0'
          >
            {result.result.map((item) => {
              const mushItem = MUSH.find((m) => m.className === item.category);

              return (
                <div
                  key={item.category}
                  className='flex flex-col items-center justify-center gap-4 p-4 lg:flex-row'
                >
                  <div
                    data-role='task-result-item'
                    className='flex flex-col items-center justify-center gap-1.5'
                  >
                    <h5 className='mb-2'>{item.category}</h5>
                    <p className='font-bold'>{`${(item.confidence * 100).toFixed(2)}%`}</p>
                    <p className='text-muted-foreground flex items-center justify-center gap-2 text-sm'>
                      <span className='italic'>{mushItem?.English}</span>
                      <span>|</span>
                      <span className='italic'>{mushItem?.Finnish}</span>
                    </p>
                    <p className='text-muted-foreground text-xs'>{mushItem?.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {dbKey && (
            <button
              className='absolute right-4 top-2 lg:hidden'
              aria-label='Close'
              onClick={() => {
                setResult(null);
              }}
            >
              X
            </button>
          )}

          {dbKey && (
            <Button
              variant='destructive'
              type='button'
              onClick={() => {
                void removeFromHistory(dbKey);
              }}
              className='mt-4'
            >
              Remove from history
            </Button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResultCard;
