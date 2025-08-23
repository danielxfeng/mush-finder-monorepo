import { create } from 'zustand';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AppMode = ['online', 'offline'] as const;

type TypeAppMode = (typeof AppMode)[number];

interface AppModeStore {
  mode: TypeAppMode;
  toggleMode: () => void;
}

const useAppModeStore = create<AppModeStore>()((set) => ({
  mode: 'offline',
  toggleMode: () => {
    set((state) => ({
      mode: state.mode === 'offline' ? 'online' : 'offline',
    }));
  },
}));

export default useAppModeStore;

export type { TypeAppMode };
