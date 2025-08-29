import { useEffect } from 'react';

import useAppModeStore from '@/lib/stores/app-mode-store';

const useAppMode = () => {
  const mode = useAppModeStore((state) => state.mode);

  useEffect(() => {
    document.body.classList.remove('online', 'offline');
    document.body.classList.add(mode);
  }, [mode]);

  return mode;
};

export default useAppMode;
