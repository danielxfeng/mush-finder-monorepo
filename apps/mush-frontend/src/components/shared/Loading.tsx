import { Loader2 } from 'lucide-react';

const Loading = () => (
  <div className='text-primary flex h-full w-full items-center justify-center'>
    <Loader2 className='h-8 w-8 animate-spin' />
  </div>
);

export default Loading;
