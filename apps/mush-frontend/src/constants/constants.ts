const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8000';
const EDGE_MODEL_URL =
  (import.meta.env.VITE_EDGE_MODEL_URL as string | undefined) ?? 'http://localhost:8000';
const API_KEY = (import.meta.env.VITE_API_KEY as string | undefined) ?? 'your_api_key_here';
const CLOUDINARY_URL =
  (import.meta.env.VITE_CLOUDINARY_URL as string | undefined) ??
  'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME';
const CLOUDINARY_PRESET =
  (import.meta.env.VITE_CLOUDINARY_PRESET as string | undefined) ?? 'ml_default';
const SENTRY_DSN = (import.meta.env.VITE_SENTRY_DSN as string | undefined) ?? '';

const MAX_HISTORY_ITEMS = 10;
const MAX_RETRY = 2;

interface MushItem {
  className: string;
  English: string;
  Finnish: string;
  description: string;
}

const MUSH: MushItem[] = [
  {
    className: 'Amanita muscaria',
    English: 'Fly agaric',
    Finnish: 'Punakärpässieni',
    description:
      'One of the most common poisonous mushrooms, instantly recognizable by its bright red cap with white spots.',
  },
  {
    className: 'Amanita spp.',
    English: 'Amanita',
    Finnish: 'Kärpässienet',
    description:
      'A large and diverse genus including many toxic and deadly species such as the death cap and destroying angel, though some are edible.',
  },
  {
    className: 'Amanita virosa',
    English: 'Destroying angel',
    Finnish: 'Valkokärpässieni',
    description:
      'One of the deadliest European mushrooms. A pure white Amanita that causes severe liver and kidney damage if consumed.',
  },
  {
    className: 'Boletus edulis',
    English: 'Porcini',
    Finnish: 'Herkkutatti',
    description:
      'Classic edible in Finland, highly sought after for its flavor and meaty texture. Can be confused with some inedible such as Tylopilus felleus.',
  },
  {
    className: 'Cantharellus cibarius',
    English: 'Chanterelle',
    Finnish: 'Keltavahvero',
    description:
      'One of the most popular edible mushrooms in Finland, valued for its fruity aroma and golden color. Can be confused with the false chanterelle.',
  },
  {
    className: 'Coprinus comatus',
    English: 'Ink cap',
    Finnish: 'Suomumustesieni',
    description:
      'Edible mushroom with a tall, shaggy white cap that autodigests into black ink with age. Best eaten young before liquefying.',
  },
  {
    className: 'Craterellus cornucopioides',
    English: 'Black trumpet',
    Finnish: 'Mustatorvisieni',
    description:
      'Edible mushroom with a dark, hollow, trumpet-shaped fruiting body. Its dark color makes it hard to spot in the forest.',
  },
  {
    className: 'Craterellus tubaeformis',
    English: 'Yellowfoot',
    Finnish: 'Suppilovahvero',
    description:
      'Edible mushroom with a gray-brown funnel cap and a yellow, hollow stipe. A very common autumn species in Finland.',
  },
  {
    className: 'Hygrophoropsis aurantiaca',
    English: 'False chanterelle',
    Finnish: 'Valevahvero',
    description:
      'Not poisonous, but considered of low culinary value. Orange in color with decurrent gills, it is often mistaken for the golden chanterelle.',
  },
  {
    className: 'Inocybe spp.',
    English: 'Fibrecaps',
    Finnish: 'Risakkaat',
    description:
      'A large genus of small brown mushrooms. Generally considered inedible and unsafe, and difficult to identify to species level.',
  },
  {
    className: 'Lactarius deliciosus group',
    English: 'Saffron milkcap',
    Finnish: 'Männynleppärousku',
    description:
      'Edible, but should be cooked thoroughly. Orange milkcaps exuding carrot-orange latex that often turns green when bruised.',
  },
  {
    className: 'Lactarius rufus',
    English: 'Red hot milkcap',
    Finnish: 'Kangasrousku',
    description:
      'A reddish-brown milkcap considered poisonous when raw. In some traditions it is eaten only after thorough boiling, but generally regarded as unsafe.',
  },
  {
    className: 'Lactarius trivialis',
    English: 'Trivial milkcap',
    Finnish: 'Haaparousku',
    description:
      'A common grayish milkcap. Considered poisonous when raw due to its acrid taste, but it is traditionally eaten after careful boiling or pickling.',
  },
  {
    className: 'Leccinum albostipitatum',
    English: 'Aspen bolete',
    Finnish: 'Haavanpunikkitatti',
    description:
      'Edible mushroom with an orange cap and a pale, scabrous stipe. Associates with aspen and poplar; flesh may grayen when cut.',
  },
  {
    className: 'Leccinum versipelle',
    English: 'Birch bolete',
    Finnish: 'Koivunpunikkitatti',
    description:
      'Edible mushroom with an orange cap and grey-black scabers on the stipe. Mycorrhizal with birch.',
  },
  {
    className: 'Russula spp.',
    English: 'Russulas',
    Finnish: 'Haperot',
    description:
      'Some species are edibles while others are toxic. Identification to species level is often difficult.',
  },
  {
    className: 'Suillus granulatus',
    English: 'Weeping bolete',
    Finnish: 'Jyvästatti',
    description:
      'Edible mushroom with a slimy cap lacking a ring. Young pores exude milky droplets. Commonly associated with pine.',
  },
  {
    className: 'Suillus luteus',
    English: 'Slippery jack',
    Finnish: 'Voitatti',
    description:
      'Edible mushroom with a brown slimy cap and a persistent ring on the stipe. Typically grows with Scots pine and other pines.',
  },
  {
    className: 'Suillus variegatus',
    English: 'Velvet bolete',
    Finnish: 'Kangastatti',
    description:
      'Edible mushroom with a dry, finely dotted yellow-brown cap and yellow pores. Typical of dry pine heaths.',
  },
  {
    className: 'Tylopilus felleus',
    English: 'Bitter bolete',
    Finnish: 'Sappitatti',
    description:
      'Inedible mushroom with a brown cap, pinkish pores, and a netted stipe. Intensely bitter—spoils mixed dishes despite being non-toxic.',
  },
];

export {
  API_KEY,
  API_URL,
  CLOUDINARY_PRESET,
  CLOUDINARY_URL,
  EDGE_MODEL_URL,
  MAX_HISTORY_ITEMS,
  MAX_RETRY,
  MUSH,
  SENTRY_DSN,
};
