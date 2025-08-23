import { forwardRef } from 'react';

import { Button } from '@/components/ui/button';

interface IconBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const IconBtn = forwardRef<HTMLButtonElement, IconBtnProps>(
  ({ children, ...props }: IconBtnProps, ref) => (
    <Button
      variant='ghost'
      className='border-foreground bg-background hover:bg-background rounded-md px-3 py-1 text-xs backdrop-blur-sm transition duration-200 hover:shadow-[0px_0px_3px_3px_rgba(0,0,0,0.1)]'
      ref={ref}
      {...props}
    >
      {children}
    </Button>
  ),
);

IconBtn.displayName = 'IconBtn';

export default IconBtn;
