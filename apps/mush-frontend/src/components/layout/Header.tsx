import { Link } from 'react-router';

import Brand from '@/components/layout/Brand';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import useAppMode from '@/lib/hooks/useAppMode';
import useAppModeStore from '@/lib/stores/app-mode-store';

const Header = () => {
  const mode = useAppMode();
  const toggleMode = useAppModeStore.getState().toggleMode;

  return (
    <header className='border-border shadow-2xs sticky top-0 z-20 flex h-16 items-center justify-center border-b backdrop-blur-md lg:h-20'>
      <div
        data-role='header-container'
        className='mx-4 flex w-full max-w-4xl items-center justify-between'
      >
        <div data-role='header-logo' className='flex items-center justify-center gap-1.5'>
          <Link to='/' className='no-underline hover:opacity-100'>
            <Brand />
          </Link>

          <div className='flex h-10 flex-col justify-between gap-1'>
            <Badge variant='secondary' className='text-xs'>
              Beta
            </Badge>
            <span className='text-muted-foreground mb-0.5 ml-1 text-xs'>
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

        <div
          data-role='header-actions'
          className='flex items-center justify-center gap-2.5 text-xs'
        >
          <Button onClick={toggleMode} variant='outline' className='text-xs'>
            {mode === 'online' ? 'Go Edge' : 'Go Online'}
          </Button>
          {/*<ThemeToggle /> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
