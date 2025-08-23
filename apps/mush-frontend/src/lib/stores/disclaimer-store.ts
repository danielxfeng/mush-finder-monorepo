import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DisclaimerState {
  skipDisclaimer: boolean;
  setSkipDisclaimer: (value: boolean) => void;
}

const useDisclaimerStore = create<DisclaimerState>()(
  persist(
    (set) => ({
      skipDisclaimer: false,
      setSkipDisclaimer: (value) => set({ skipDisclaimer: value }),
    }),
    {
      name: 'disclaimer-storage', // localStorage key
    },
  ),
);

export default useDisclaimerStore;
