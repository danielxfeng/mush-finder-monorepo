import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QAItems } from '@/constants/QAItems';

const QA = () => {
  return (
    <main className='mx-auto my-6 mb-10 h-full w-full max-w-4xl flex-1 px-4'>
      <h1 className='text-primary'>Q&A</h1>

      <div className='grid gap-4'>
        {QAItems.map((item) => (
          <Card key={item.question} className='hover:bg-muted transition hover:shadow-md'>
            <CardHeader>
              <CardTitle className='text-xl'>{item.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm leading-relaxed'>{item.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
};

export default QA;
