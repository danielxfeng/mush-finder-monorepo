import type { HashTask, TypeAppMode } from '@repo/schemas';

import { offlineInference } from '@/lib/inference-engine/offline-inference';
import { onlineInference } from '@/lib/inference-engine/online-inference';

type InferenceFn = (hash: string, file: File) => Promise<HashTask>;

const InferenceEngineFactory = (mode: TypeAppMode): InferenceFn => {
  switch (mode) {
    case 'online':
      return onlineInference;
    case 'offline':
      return offlineInference;
    default:
      throw new Error('Unknown mode'); // Should not be here.
  }
};

export default InferenceEngineFactory;
