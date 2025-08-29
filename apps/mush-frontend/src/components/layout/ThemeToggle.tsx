import { Laptop, Moon, Sun } from 'lucide-react';

import IconBtn from '@/components/shared/IconBtn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useTheme from '@/lib/hooks/useTheme';
import useThemeStore, { type TypeTheme } from '@/lib/stores/theme-store';

const Item = ({ children, themeValue }: { children: React.ReactNode; themeValue: TypeTheme }) => {
  const setTheme = useThemeStore.getState().setTheme; // snapshot

  return (
    <DropdownMenuItem
      onSelect={() => {
        setTheme(themeValue);
      }}
    >
      {children}
    </DropdownMenuItem>
  );
};

const ThemeToggle = () => {
  const currentTheme = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconBtn tooltipContent='Switch theme'>
          {currentTheme === 'light' ? <Sun /> : <Moon />}
        </IconBtn>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuGroup className='flex gap-2'>
          <Item themeValue='system'>{<Laptop />}</Item>
          <Item themeValue='light'>{<Sun />}</Item>
          <Item themeValue='dark'>{<Moon />}</Item>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
