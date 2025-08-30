import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MUSH } from '@/constants/constants';

const Species = () => {
  return (
    <main className='mx-auto my-6 h-full w-full max-w-4xl flex-1 px-4'>
      <h1 className='text-primary'>Species Overview</h1>

      <div className='grid gap-4'>
        {MUSH.map((mush) => (
          <Card key={mush.className} className='transition hover:shadow-md'>
            <CardHeader>
              <CardTitle className='text-xl'>{mush.className}</CardTitle>
              <p className='text-muted-foreground text-sm'>
                {mush.English} ({mush.Finnish})
              </p>
            </CardHeader>
            <CardContent>
              <p className='text-sm leading-relaxed'>{mush.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
};

export default Species;
