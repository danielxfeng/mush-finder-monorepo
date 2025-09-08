import History from '@/components/History';
import InferenceEntry from '@/components/inference/InferenceEntry';
import Introduction from '@/components/Introduction';

const App = () => {
  return (
    <main className='my-8 flex w-full flex-1 flex-col items-center justify-center gap-10 lg:my-12'>
      <Introduction />
      <InferenceEntry />
      <History />
    </main>
  );
};

export default App;
