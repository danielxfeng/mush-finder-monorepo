import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className='text-muted-foreground border-border flex h-12 items-center justify-center border-t text-xs'>
      <div className='flex w-full max-w-2xl flex-col items-center justify-between gap-1 lg:flex-row'>
        <div className='flex items-center gap-1' data-role='footer-developer'>
          <span>Developed with</span>
          <Heart className='h-4 w-4 animate-pulse fill-[var(--primary)] stroke-0' />
          <span>
            by{' '}
            <a href='https://www.linkedin.com/in/xin-daniel-feng' target='_blank' rel='noreferrer'>
              Daniel's Lab
            </a>
          </span>
        </div>

        <a href='/terms' target='_blank' rel='noreferrer'>
          Terms and Conditions, and Privacy Policy
        </a>
      </div>
    </footer>
  );
};

export default Footer;
