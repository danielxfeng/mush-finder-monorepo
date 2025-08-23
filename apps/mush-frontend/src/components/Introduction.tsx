import RotatingParagraph from '@/components/shared/RotatingParagraph';

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
    <p>
      The model was trained on over 10,000 mushroom images gathered through{' '}
      <a href='https://www.gbif.org' target='_blank' rel='noopener noreferrer'>
        GBIF
      </a>
      , with photos contributed under CC licenses.
    </p>
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
  return (
    <section className='flex w-full max-w-prose flex-col items-center gap-3 px-1.5'>
      <h2 className='text-center'>Welcome to Mush Finder</h2>
      <RotatingParagraph items={items} height='h-16' gap={5000} />
    </section>
  );
};

export default Introduction;
