import type { HistoryDb, TaskResponse } from '@repo/schemas';
import { useEffect, useState } from 'react';

import ResultCard from './shared/ResultCard';

export const mockHistory: HistoryDb[] = [
  {
    p_hash: 'hash001',
    img: new File(['fake image content'], 'mushroom1.png', { type: 'image/png' }),
    mode: 'online',
    taskResponse: {
      p_hash: 'hash001',
      status: 'done',
      result: [
        { category: 'Mushroom 1', confidence: 0.92 },
        { category: 'Mushroom 2', confidence: 0.05 },
        { category: 'Mushroom 3', confidence: 0.03 },
      ],
    },
    createdAt: new Date('2025-08-01T10:00:00Z'),
  },
  {
    p_hash: 'hash002',
    img: new File(['fake image content'], 'mushroom2.png', { type: 'image/png' }),
    mode: 'offline',
    taskResponse: {
      p_hash: 'hash002',
      status: 'done',
      result: [
        { category: 'Mushroom 2', confidence: 0.81 },
        { category: 'Mushroom 1', confidence: 0.12 },
        { category: 'Mushroom 3', confidence: 0.07 },
      ],
    },
    createdAt: new Date('2025-08-02T14:30:00Z'),
  },
  {
    p_hash: 'hash003',
    img: new File(['fake image content'], 'mushroom3.png', { type: 'image/png' }),
    mode: 'online',
    taskResponse: {
      p_hash: 'hash003',
      status: 'processing',
      result: [],
    },
    createdAt: new Date('2025-08-03T09:15:00Z'),
  },
];

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
      className='hover:bg-muted relative flex w-full items-center justify-between rounded-xl p-4 text-sm transition-all duration-200 ease-in-out lg:w-fit lg:gap-16'
      onClick={() => {
        setResult(item.taskResponse);
      }}
    >
      <img className='max-w-[100px] rounded-md' alt='History Item' src={preview} />
      <div data-role='history-item-details' className='flex flex-col px-4 text-xs'>
        {results.map((res) => (
          <div key={res.category} className='flex items-center justify-between gap-2'>
            <span className='font-semibold'>{res.category}</span>
            <span className='text-muted-foreground'>{(res.confidence * 100).toFixed(2)}%</span>
          </div>
        ))}
      </div>
      <ResultCard result={result} setResult={setResult} dbKey={item.p_hash} />
    </div>
  );
};

const History = () => {
  return (
    <div data-role='history' className='flex w-full max-w-4xl flex-col items-center justify-center'>
      <div className='text-muted-foreground m-0 mb-4 flex w-full items-center justify-center gap-3 text-sm'>
        <span>--------</span>
        <h3 className='m-0 text-sm'>Local history</h3>
        <span>--------</span>
      </div>
      <div data-role='history-items' className='flex flex-col items-center justify-center gap-4'>
        {mockHistory.map((item) => (
          <HistoryItem key={item.p_hash} item={item} />
        ))}
      </div>
    </div>
  );
};

export default History;
