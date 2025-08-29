import type { HistoryDb, TaskResponse } from '@repo/schemas';
import { useEffect, useState } from 'react';

import ResultCard from '@/components/shared/ResultCard';
import useHistoryStore from '@/lib/stores/history-store';

const HistoryItem = ({ item }: { item: HistoryDb }) => {
  const results = item.taskResponse.result;
  const [preview, setPreview] = useState<string>();
  const [result, setResult] = useState<TaskResponse | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    if (item.img instanceof File) {
      const objectUrl = URL.createObjectURL(item.img);
      setPreview(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
  }, [item.img]);

  return (
    <div
      data-role='history-item-container'
      className='relative flex w-full items-center justify-center text-sm'
    >
      <div
        data-role='history-item'
        className='hover:bg-muted flex w-full items-center justify-between rounded-xl transition-all duration-200 ease-in-out hover:cursor-pointer lg:w-fit lg:gap-16 lg:p-4'
        onClick={() => {
          setResult(item.taskResponse);
        }}
      >
        <img className='h-24 w-24 rounded-lg object-cover' alt='History Item' src={preview} />
        <div data-role='history-item-details' className='flex flex-col px-4 text-xs'>
          {results.map((res) => (
            <div key={res.category} className='flex items-center justify-between gap-2'>
              <span className='font-semibold'>{res.category}</span>
              <span className='text-muted-foreground'>{(res.confidence * 100).toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>
      {/* There is a potential performance issue.
          But it's easier to set the animation, and we have limited the size of the list. */}
      <ResultCard result={result} setResult={setResult} dbKey={item.p_hash} />
    </div>
  );
};

const History = () => {
  const historyItems = useHistoryStore((state) => state.history);

  if (historyItems.length === 0) return null;

  return (
    <div data-role='history' className='flex w-full max-w-4xl flex-col items-center justify-center'>
      <div className='text-muted-foreground m-0 mb-4 flex w-full items-center justify-center gap-3 text-sm'>
        <span>--------</span>
        <h3 className='m-0 text-sm'>Local history</h3>
        <span>--------</span>
      </div>
      <div data-role='history-items' className='flex flex-col items-center justify-center gap-4'>
        {historyItems.map((item) => (
          <HistoryItem key={item.p_hash} item={item} />
        ))}
      </div>
    </div>
  );
};

export default History;
