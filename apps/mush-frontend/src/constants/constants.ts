const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8000';
const API_KEY = (import.meta.env.VITE_API_KEY as string | undefined) ?? 'your_api_key_here';

const INTRO_Title = 'Welcome to Mush Finder';
const INTRO_TEXT =
  'An experimental machine learning tool I trained to help identify 20 common mushroom species found in Finnish forests.';

export { API_KEY, API_URL, INTRO_TEXT, INTRO_Title };
