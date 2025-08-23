import { forwardRef } from 'react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface IconBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  tooltipContent: string;
}

const IconBtn = forwardRef<HTMLButtonElement, IconBtnProps>(
  ({ children, tooltipContent, ...props }: IconBtnProps, ref) => (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant='ghost'
          className={cn(
            'rounded-md px-3 py-1 text-xs backdrop-blur-sm transition duration-200',
            'hover:bg-background dark:hover:bg-background',
            'hover:shadow-[0px_0px_3px_3px_rgba(0,0,0,0.1)]',
            'dark:hover:shadow-[0_0_3px_3px_rgba(255,255,255,0.1)]',
          )}
          ref={ref}
          {...props}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltipContent}</TooltipContent>
    </Tooltip>
  ),
);

IconBtn.displayName = 'IconBtn';

export default IconBtn;
