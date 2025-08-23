import Disclaimer from '@/components/Disclaimer';
import Inference from '@/components/inference/Inference';
import Introduction from '@/components/Introduction';

const App = () => {
  return (
    <main className='flex w-full flex-1 flex-col items-center justify-center'>
      <Introduction />
      <Disclaimer />
      <Inference />
    </main>
  );
};

export default App;
