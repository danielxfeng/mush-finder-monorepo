import RotatingParagraph from '@/components/shared/RotatingParagraph';
import { Badge } from '@/components/ui/badge';
import useAppModeStore from '@/lib/stores/app-mode-store';

const items = [
  <p>
    A experimental AI tool to suggest which of{' '}
    <a href='/species' target='_blank' rel='noopener noreferrer'>
      20 common mushrooms
    </a>{' '}
    you might be seeing in Finnish forests.
  </p>,
  <p>
    Powered by a custom transfer learning model built on Facebook&apos;s ConvNeXt family of CNNs.
  </p>,
  <p>
    The model was trained on over 10,000 mushroom images gathered through{' '}
    <a href='https://www.gbif.org' target='_blank' rel='noopener noreferrer'>
      GBIF
    </a>
    , with photos contributed under CC licenses.
  </p>,
  <p>
    MushFinder comes in two versions: an online model with higher accuracy, and an offline edge
    version that works without internet access.
  </p>,
  <p>
    MushFinder is deployed using a serverless and distributed architecture, with message queues
    enabling load smoothing, async processing, scalability, and fault tolerance.
  </p>,
];

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
      <RotatingParagraph items={items} height='h-16' gap={5000} />
    </section>
  );
};

export default Introduction;
