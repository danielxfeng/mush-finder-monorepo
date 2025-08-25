const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8000';
const EDGE_MODEL_URL =
  (import.meta.env.VITE_EDGE_MODEL_URL as string | undefined) ?? 'http://localhost:8000';
const API_KEY = (import.meta.env.VITE_API_KEY as string | undefined) ?? 'your_api_key_here';
const CLOUDINARY_URL =
  (import.meta.env.VITE_CLOUDINARY_URL as string | undefined) ??
  'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME';
const CLOUDINARY_PRESET =
  (import.meta.env.VITE_CLOUDINARY_PRESET as string | undefined) ?? 'ml_default';

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
    className: 'Mushroom 1',
    English: 'Mushroom 1',
    Finnish: 'Sieni 1',
    description: 'This is Mushroom 1',
  },
  {
    className: 'Mushroom 2',
    English: 'Mushroom 2',
    Finnish: 'Sieni 2',
    description: 'This is Mushroom 2',
  },
  {
    className: 'Mushroom 3',
    English: 'Mushroom 3',
    Finnish: 'Sieni 3',
    description: 'This is Mushroom 3',
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
};
