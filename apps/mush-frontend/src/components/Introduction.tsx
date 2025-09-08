import RotatingParagraph from '@/components/shared/RotatingParagraph';
import { Badge } from '@/components/ui/badge';
import { QAItems } from '@/constants/QAItems';
import useAppModeStore from '@/lib/stores/app-mode-store';

const Introduction = () => {
  const mode = useAppModeStore((state) => state.mode);
  return (
    <section className='text-muted-foreground flex w-full max-w-prose flex-col items-center gap-3 px-4'>
      <div className='flex w-full items-start justify-center gap-2'>
        <h2 className='text-primary text-center'>Mush Finder</h2>
        <Badge variant='secondary' className='test-xs'>
          {mode === 'online' ? 'Online' : 'Edge'}
        </Badge>
      </div>
      <RotatingParagraph items={QAItems.map((qa) => qa.answer)} height='h-30' gap={5000} />
    </section>
  );
};

export default Introduction;
