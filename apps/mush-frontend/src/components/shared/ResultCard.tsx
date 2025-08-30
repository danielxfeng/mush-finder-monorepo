import type { TaskResponse } from '@repo/schemas';
import * as Sentry from '@sentry/react';
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
    } catch (error) {
      Sentry.captureException(error);
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
            'border-foreground lg:w-2xl flex w-full flex-col items-center justify-center gap-2 rounded-xl border p-2 py-4 lg:p-4',
            'bg-background/70 fixed top-1/2 z-20 -translate-y-1/2 backdrop-blur-md',
            'lg:absolute lg:inset-auto lg:bottom-0 lg:left-1/2 lg:-translate-x-1/2',
          )}
        >
          <h4>The Inference Result:</h4>
          <p className='text-muted-foreground mb-1 text-xs'>⚠️ Information may be inaccurate</p>
          <div
            data-set='task-result-content'
            className='divide-border grid w-full grid-cols-1 divide-y lg:grid-cols-3 lg:divide-x lg:divide-y-0'
          >
            {result.result.map((item) => {
              const mushItem = MUSH.find((m) => m.className === item.category);

              return (
                <div
                  key={item.category}
                  className='flex w-full flex-1 flex-col items-center justify-center gap-1 p-2 lg:flex-row'
                >
                  <div
                    data-role='task-result-item'
                    className='grid w-full grid-cols-2 gap-1 lg:grid-cols-1'
                  >
                    <p className='mb-1 flex w-full items-center justify-center'>{item.category}</p>
                    <p className='mb-1 flex w-full items-center justify-center'>{`${(item.confidence * 100).toFixed(2)}%`}</p>
                    <p className='text-muted-foreground flex w-full items-center justify-center gap-1.5 text-sm italic'>
                      {mushItem?.English}
                    </p>
                    <p className='text-muted-foreground flex w-full items-center justify-center gap-1.5 text-sm italic'>
                      {mushItem?.Finnish}
                    </p>
                    <p className='text-muted-foreground col-span-2 flex w-full items-center justify-center text-xs lg:col-span-1'>
                      {mushItem?.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
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
          <Button
            variant='outline'
            type='button'
            onClick={(e) => {
              e.stopPropagation();
              setResult(null);
            }}
          >
            Back
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResultCard;
