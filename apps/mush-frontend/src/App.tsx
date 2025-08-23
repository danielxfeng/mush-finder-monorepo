import InferenceEntry from '@/components/inference/InferenceEntry';
import Introduction from '@/components/Introduction';

const App = () => {
  return (
    <main className='flex w-full flex-1 flex-col items-center justify-center gap-24'>
      <Introduction />
      <InferenceEntry />
    </main>
  );
};

export default App;
