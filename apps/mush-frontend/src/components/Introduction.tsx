import RotatingParagraph from '@/components/shared/RotatingParagraph';
import { Badge } from '@/components/ui/badge';
import useAppModeStore from '@/lib/stores/app-mode-store';

const items = [
  <p>
    An experimental AI tool to suggest which of{' '}
    <a href='/species' target='_blank' rel='noopener noreferrer'>
      20 common mushrooms
    </a>{' '}
    you might be seeing in Finnish forests.
  </p>,
  <p>
    Just take a picture of the mushroom and let MushFinder do the rest. Try to capture a clear shot
    with the mushroom centered. No matter the resolution, MushFinder handles it.
  </p>,
  <p>
    It’s normal for the inference service to return results even when no mushroom is present in the
    image, but you can expect a lower confidence score in such cases.
  </p>,
  <p>Powered by a custom transfer learning model built on Facebook’s ConvNeXt family of CNNs.</p>,
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
    To use offline mode, you need to at least run the inference service once while online to cache
    the required files.
  </p>,
  <p>
    It’s normal that the two models return different results for the same image. This is a
    limitation of the current technology.
  </p>,
  <p>
    MushFinder is deployed using a serverless, distributed architecture, with message queues
    enabling load smoothing, asynchronous processing, scalability, and fault tolerance.
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
