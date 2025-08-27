import type { TaskResponse } from '@repo/schemas';
import { useState } from 'react';

import ResultCard from '@/components/shared/ResultCard';

const mockTaskResponse: TaskResponse | null = {
  p_hash: 'samplehash',
  status: 'done',
  result: [
    { category: 'Mushroom 1', confidence: 0.92 },
    { category: 'Mushroom 2', confidence: 0.76 },
    { category: 'Mushroom 3', confidence: 0.64 },
  ],
};

const Inference = () => {
  const [result, setResult] = useState<TaskResponse | null>(mockTaskResponse);
  return (
    <form>
      <h2>Mushroom Inference</h2>
      <ResultCard result={result} setResult={setResult} />
    </form>
  );
};

export default Inference;
