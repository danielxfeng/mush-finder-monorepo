import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

interface LoadingProps {
  className?: string;
}

const Loading = ({ className }: LoadingProps) => (
  <div className={cn('text-primary flex h-full w-full items-center justify-center', className)}>
    <Loader2 className='h-8 w-8 animate-spin' />
  </div>
);

export default Loading;
