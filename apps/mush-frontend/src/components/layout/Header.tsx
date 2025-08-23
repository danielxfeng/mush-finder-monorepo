import { Sun } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Header = () => {
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
          <Button
            variant='outline'
            className='border-foreground bg-background hover:bg-background rounded-md px-3 py-1 text-xs backdrop-blur-sm transition duration-200 hover:shadow-[0px_0px_3px_3px_rgba(0,0,0,0.1)]'
          >
            Online
          </Button>
          <Button
            variant='ghost'
            className='border-foreground bg-background hover:bg-background rounded-md px-3 py-1 text-xs backdrop-blur-sm transition duration-200 hover:shadow-[0px_0px_3px_3px_rgba(0,0,0,0.1)]'
          >
            <Sun />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
