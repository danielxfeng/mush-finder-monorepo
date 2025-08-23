import { useState } from 'react';

import ConsentDialog from '@/components/inference/ConsentDialog';
import Inference from '@/components/inference/Inference';
import useDisclaimerStore from '@/lib/stores/disclaimer-store';

const InferenceEntry = () => {
  const skipDisclaimer = useDisclaimerStore((state) => {
    return state.skipDisclaimer;
  });

  const [consent, setConsent] = useState(skipDisclaimer);

  return consent ? <Inference /> : <ConsentDialog setConsent={setConsent} />;
};

export default InferenceEntry;
