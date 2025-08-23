import { useEffect, useState } from 'react';

import useThemeStore, { type TypeTheme } from '@/lib/stores/theme-store';

type CurrentTheme = Exclude<TypeTheme, 'system'>;

const getSystemTheme = (): CurrentTheme => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

const getCurrentTheme = (theme: TypeTheme): CurrentTheme => {
  if (theme === 'system') return getSystemTheme();
  return theme;
};

const useTheme = (): CurrentTheme => {
  const theme = useThemeStore((state) => state.theme);
  const [currentTheme, setCurrentTheme] = useState<CurrentTheme>(getCurrentTheme(theme));

  // Update applied theme when theme changes
  useEffect(() => {
    setCurrentTheme(getCurrentTheme(theme));
  }, [theme]);

  // Apply the theme based on value
  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(currentTheme);
  }, [currentTheme]);

  // Update theme based on system preference
  useEffect(() => {
    if (theme !== 'system') return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      setCurrentTheme(getSystemTheme());
    };
    media.addEventListener('change', handleChange);

    return () => {
      media.removeEventListener('change', handleChange);
    };
  }, [theme]);

  return currentTheme;
};

export default useTheme;
