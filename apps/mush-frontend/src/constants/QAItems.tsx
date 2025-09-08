const QAItems = [
  {
    question: 'What is MushFinder?',
    answer: (
      <p>
        An experimental AI tool to suggest which of{' '}
        <a href='/species' target='_blank' rel='noopener noreferrer'>
          20 common mushrooms
        </a>{' '}
        you might be seeing in Finnish forests.
      </p>
    ),
  },
  {
    question: 'Is MushFinder suitable for everyday use?',
    answer: (
      <p>
        It is mainly a tech toy at this stage, not intended for everyday use, and the results may
        not be accurate. Use at your own risk.
      </p>
    ),
  },
  {
    question: 'How should I take pictures for better results?',
    answer: (
      <p>
        Try to take a picture of the whole mushroom in its natural environment, keep it centered,
        and show both the cap and the stem, if possible (Yep, I know it's very difficult). You don’t
        need a high-end camera, clarity matters more than resolution.
      </p>
    ),
  },
  {
    question: 'Will the model give results if no mushroom is present?',
    answer: (
      <p>
        It’s normal for the inference service to return results even when no mushroom is present in
        the image, but you can expect a lower confidence score in such cases.
      </p>
    ),
  },
  {
    question: 'What model powers MushFinder?',
    answer: (
      <p>
        Powered by a custom transfer learning model built on Facebook’s ConvNeXt family of CNNs.
      </p>
    ),
  },
  {
    question: 'Where did the training data come from?',
    answer: (
      <p>
        The model was trained on over 10,000 mushroom images gathered through{' '}
        <a href='https://www.gbif.org' target='_blank' rel='noopener noreferrer'>
          GBIF
        </a>
        , with photos contributed under CC licenses.
      </p>
    ),
  },
  {
    question: 'Are there multiple versions of MushFinder?',
    answer: (
      <p>
        MushFinder comes in two versions: an online model with higher accuracy, and an offline edge
        version that works without internet access.
      </p>
    ),
  },
  {
    question: 'How does offline mode work?',
    answer: (
      <p>
        To use offline mode, you need to at least run the inference service once while online to
        cache the required files.
      </p>
    ),
  },
  {
    question: 'Why do online and offline models give different results?',
    answer: (
      <p>
        It’s normal that the two models return different results for the same image. This is a
        limitation of the current technology.
      </p>
    ),
  },
  {
    question: 'How is MushFinder deployed?',
    answer: (
      <p>
        MushFinder is deployed using a serverless, distributed architecture, with message queues
        enabling load smoothing, asynchronous processing, scalability, and fault tolerance.
      </p>
    ),
  },
];

export { QAItems };
