import { Wifi, WifiOff } from 'lucide-react';

import ThemeToggle from '@/components/layout/ThemeToggle';
import IconBtn from '@/components/shared/IconBtn';
import { Badge } from '@/components/ui/badge';
import useAppModeStore from '@/lib/stores/app-mode-store';

const Header = () => {
  const { mode, toggleMode } = useAppModeStore();

  return (
    <header className='flex h-14 items-center justify-center'>
      <div
        data-role='header-container'
        className='mx-1.5 flex w-full max-w-4xl items-center justify-between'
      >
        <div
          data-role='header-logo'
          className='flex items-center justify-center gap-1.5 lg:gap-2.5'
        >
          <h1 className='m-0 text-xl font-bold'>Mush Finder</h1>

          <div className='flex flex-col items-start gap-1'>
            <Badge variant='secondary' className='text-xs'>
              Beta
            </Badge>
            <span className='text-muted-foreground ml-1.5 text-xs'>
              by{' '}
              <a
                href='https://danielslab.dev'
                target='_blank'
                rel='noreferrer'
                className='hover:underline'
              >
                Daniel's Lab
              </a>
            </span>
          </div>
        </div>

        <div data-role='header-actions' className='flex items-center justify-center gap-2.5'>
          <IconBtn onClick={toggleMode}>{mode === 'online' ? <Wifi /> : <WifiOff />}</IconBtn>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
