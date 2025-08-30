import * as Sentry from '@sentry/react';
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react';
import { toast } from 'sonner';

import Loading from '@/components/shared/Loading';
import { Button } from '@/components/ui/button';
import { hasModel, putModelDb } from '@/lib/indexed-db-helper';
import { downloadEdgeModel } from '@/lib/inference-engine/offline-inference';
import useAppModeStore from '@/lib/stores/app-mode-store';

interface NoModelProps {
  setCheck: Dispatch<SetStateAction<boolean | null>>;
}

const NoModel = ({ setCheck }: NoModelProps) => {
  const [loading, setLoading] = useState(false);

  const downloadModelHandler = async () => {
    try {
      setLoading(true);
      const blob = await downloadEdgeModel();
      await putModelDb({ id: '7cf4b53e-01e9-4781-9fcb-767174d89979', model: blob });
      setCheck(true);
    } catch (error) {
      Sentry.captureException(error);
      toast.error('Failed to download the model. Please try later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div
      data-role='offline-no-model'
      className='flex w-full flex-col items-center justify-center gap-6 px-4'
    >
      <Button
        onClick={() => void downloadModelHandler()}
        disabled={loading}
        data-umami-event='edge-model-download'
      >
        Download
      </Button>
      <p className='text-muted-foreground text-center'>
        To use offline inference, you need to download the model to the device first.
      </p>
    </div>
  );
};

interface EdgeModelGuardProps {
  children: React.ReactNode;
}

const EdgeModelGuard = ({ children }: EdgeModelGuardProps) => {
  const mode = useAppModeStore((state) => state.mode);
  const [check, setCheck] = useState<boolean | null>(null);

  useEffect(() => {
    if (mode === 'online') {
      setCheck(true);
      return;
    }

    hasModel()
      .then(setCheck)
      .catch(() => {
        setCheck(false);
      });
  }, [mode]);

  return check === null ? <Loading /> : check ? <>{children}</> : <NoModel setCheck={setCheck} />;
};

export default EdgeModelGuard;
