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
      'Iconic red cap with white warts; widespread in boreal forests. Toxic/psychoactive—do not eat.',
  },
  {
    className: 'Amanita spp.',
    English: 'Amanita (genus)',
    Finnish: 'Kärpässienet',
    description:
      'Large genus including edible, toxic and deadly species; identification to species level is critical.',
  },
  {
    className: 'Amanita virosa',
    English: 'Destroying angel',
    Finnish: 'Valkokärpässieni',
    description:
      'All-white Amanita with a volva at the base; one of the deadliest European mushrooms. Absolutely not for consumption.',
  },
  {
    className: 'Boletus edulis',
    English: 'Porcini / King bolete',
    Finnish: 'Herkkutatti',
    description:
      'Thick white stipe with reticulation and a brown cap; mycorrhizal with spruce/birch. Classic edible in Finland.',
  },
  {
    className: 'Cantharellus cibarius',
    English: 'Golden chanterelle',
    Finnish: 'Keltavahvero (kantarelli)',
    description:
      'Egg-yolk yellow funnel with forked, ridged “gills”; fruity aroma. Common in Finnish forests.',
  },
  {
    className: 'Coprinus comatus',
    English: 'Shaggy ink cap',
    Finnish: 'Suomumustesieni',
    description:
      'Tall, shaggy white cap that autodigests to black ink with age; found in grasslands/roadsides.',
  },
  {
    className: 'Craterellus cornucopioides',
    English: 'Black trumpet / Horn of plenty',
    Finnish: 'Mustatorvisieni',
    description:
      'Dark, hollow, trumpet-shaped fruiting body; blends with leaf litter in late season coniferous woods.',
  },
  {
    className: 'Craterellus tubaeformis',
    English: 'Yellowfoot / Funnel chanterelle',
    Finnish: 'Suppilovahvero',
    description:
      'Gray-brown funnel cap with yellow, hollow stipe; very common autumn species in Finland.',
  },
  {
    className: 'Hygrophoropsis aurantiaca',
    English: 'False chanterelle',
    Finnish: 'Valevahvero',
    description:
      'Orange cap with true gills (not ridges); resembles chanterelle but thinner and usually inferior/inedible for many.',
  },
  {
    className: 'Inocybe spp.',
    English: 'Fibrecaps (genus Inocybe)',
    Finnish: 'Risakkaat',
    description:
      'Brownish fibrous caps; many species contain muscarine and are poisonous. Avoid consumption.',
  },
  {
    className: 'Lactarius deliciosus group',
    English: 'Saffron milk cap group',
    Finnish: 'Männynleppärousku -ryhmä',
    description:
      'Orange milkcaps exuding carrot-orange latex that may green with bruising; includes closely related taxa under pine.',
  },
  {
    className: 'Lactarius rufus',
    English: 'Rufous/Red hot milkcap',
    Finnish: 'Kangasrousku',
    description: 'Reddish-brown cap; very acrid latex. Abundant in pine woods on poor soils.',
  },
  {
    className: 'Lactarius trivialis',
    English: 'Ugly milkcap',
    Finnish: 'Haaparousku',
    description:
      'Grey-brown to purplish, slimy cap; common with birch and spruce in northern Europe.',
  },
  {
    className: 'Leccinum albostipitatum',
    English: 'Aspen bolete (orange-cap, white-stemmed)',
    Finnish: 'Haavanpunikkitatti',
    description:
      'Orange cap; pale, scabrous stipe; associates with aspen/poplar. Flesh may grayen.',
  },
  {
    className: 'Leccinum versipelle',
    English: 'Orange birch bolete',
    Finnish: 'Koivunpunikkitatti',
    description: 'Orange cap with grey-black scabers on the stipe; mycorrhizal with birch.',
  },
  {
    className: 'Russula spp.',
    English: 'Brittlegills (genus Russula)',
    Finnish: 'Haperot',
    description:
      'Brittle, chalky gills and stipes; cap colors vary widely. Edibility ranges from excellent to inedible—species-level ID needed.',
  },
  {
    className: 'Suillus granulatus',
    English: 'Weeping bolete',
    Finnish: 'Jyvästatti',
    description: 'Slimy cap without a ring; young pores exude milky droplets. Common near pine.',
  },
  {
    className: 'Suillus luteus',
    English: 'Slippery jack',
    Finnish: 'Voitatti',
    description:
      'Brown slimy cap with a persistent ring on the stipe; forms with Scots pine and other pines.',
  },
  {
    className: 'Suillus variegatus',
    English: 'Velvet/variegated bolete',
    Finnish: 'Kangastatti',
    description: 'Dry, finely dotted yellow-brown cap; yellow pores; typical in dry pine heaths.',
  },
  {
    className: 'Tylopilus felleus',
    English: 'Bitter bolete',
    Finnish: 'Sappitatti',
    description:
      'Brown cap, pinkish pores, and a netted stipe; intensely bitter—spoils mixed dishes despite being non-toxic.',
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
