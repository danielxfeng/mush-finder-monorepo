import { Wifi, WifiOff } from 'lucide-react';

import Brand from '@/components/layout/Brand';
import ThemeToggle from '@/components/layout/ThemeToggle';
import IconBtn from '@/components/shared/IconBtn';
import { Badge } from '@/components/ui/badge';
import useAppMode from '@/lib/hooks/useAppMode';
import useAppModeStore from '@/lib/stores/app-mode-store';

const Header = () => {
  const mode = useAppMode();
  const toggleMode = useAppModeStore.getState().toggleMode;

  return (
    <header className='border-border bg-background/70 shadow-2xs sticky flex h-16 items-center justify-center border-b backdrop-blur-xl lg:h-20'>
      <div
        data-role='header-container'
        className='mx-1.5 flex w-full max-w-4xl items-center justify-between'
      >
        <div
          data-role='header-logo'
          className='flex items-center justify-center gap-1.5 lg:gap-2.5'
        >
          <h1 className='sr-only'>Mush Finder</h1>
          <Brand />

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
                className='font-semibold'
              >
                Daniel's Lab
              </a>
            </span>
          </div>
        </div>

        <div data-role='header-actions' className='flex items-center justify-center gap-2.5'>
          <IconBtn
            onClick={toggleMode}
            tooltipContent={
              mode === 'online' ? 'Switch to offline inference' : 'Switch to online inference'
            }
          >
            {mode === 'online' ? <Wifi /> : <WifiOff />}
          </IconBtn>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
