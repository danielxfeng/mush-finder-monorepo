import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Theme = ['light', 'dark', 'system'] as const;
type TypeTheme = (typeof Theme)[number];

interface ThemeState {
  theme: TypeTheme;
  setTheme: (theme: TypeTheme) => void;
}

const useThemeStore = create<ThemeState>()(
  persist<ThemeState>(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
    },
  ),
);

export default useThemeStore;

export type { TypeTheme };
