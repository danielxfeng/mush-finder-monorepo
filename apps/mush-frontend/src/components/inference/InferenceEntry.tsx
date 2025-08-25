import ConsentGuard from '@/components/inference/ConsentGuard';
import EdgeModelGuard from '@/components/inference/EdgeModelGuard';
import Inference from '@/components/inference/Inference';

const InferenceEntry = () => (
  <ConsentGuard>
    <EdgeModelGuard>
      <Inference />
    </EdgeModelGuard>
  </ConsentGuard>
);

export default InferenceEntry;
