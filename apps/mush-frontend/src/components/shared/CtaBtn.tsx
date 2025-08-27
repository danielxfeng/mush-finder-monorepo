import { forwardRef } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CtaBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const CtaBtn = forwardRef<HTMLButtonElement, CtaBtnProps>(
  ({ children, ...props }: CtaBtnProps, ref) => (
    <Button
      className={cn(
        'cursor-pointer rounded-full px-12 py-6 text-xl transition duration-200 hover:opacity-95 hover:shadow-xl focus:ring-2',
        'hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)]',
        'dark:hover:shadow-[0_20px_25px_-5px_rgba(255,255,255,0.1),0_10px_10px_-5px_rgba(255,255,255,0.04)]',
      )}
      ref={ref}
      {...props}
    >
      {children}
    </Button>
  ),
);

CtaBtn.displayName = 'CtaBtn';

export default CtaBtn;
