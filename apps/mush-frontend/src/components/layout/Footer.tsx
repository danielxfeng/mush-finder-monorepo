import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className='text-muted-foreground flex h-10 items-center justify-center text-sm lg:mb-16 lg:h-12'>
      <div className='flex items-center gap-1' data-role='footer-developer'>
        <span>Developed with</span>
        <Heart className='h-4 w-4 animate-pulse fill-sky-400 stroke-0' />
        <span>
          by{' '}
          <a
            href='https://www.linkedin.com/in/xin-daniel-feng'
            target='_blank'
            rel='noreferrer'
            className='text-foreground hover:underline'
          >
            Daniel's Lab
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
