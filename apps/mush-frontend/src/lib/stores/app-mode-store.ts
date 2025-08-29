import type { TypeAppMode } from '@repo/schemas';
import { create } from 'zustand';

interface AppModeStore {
  mode: TypeAppMode;
  toggleMode: () => void;
}

const useAppModeStore = create<AppModeStore>()((set) => ({
  mode: 'online',
  toggleMode: () => {
    set((state) => ({
      mode: state.mode === 'offline' ? 'online' : 'offline',
    }));
  },
}));

export default useAppModeStore;
