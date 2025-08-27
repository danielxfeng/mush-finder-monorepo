import { motion } from 'motion/react';

const Brand = () => {
  const text = 'Mush Finder';
  const textArray = text.split('');
  const delay = 0.08;

  return (
    <div className='text-primary flex text-2xl font-bold'>
      <span aria-hidden='true'>
        {textArray.map((char, index) => (
          <motion.span
            key={index}
            aria-hidden='true'
            className='bg-linear-1/shorter from-[var(--primary)] to-[var(--primary-foreground)] bg-clip-text text-transparent drop-shadow-md'
            initial='hidden'
            animate='visible'
            variants={{
              hidden: { opacity: 0, filter: 'blur(10px)' },
              visible: {
                opacity: 1,
                filter: 'blur(0px)',
                transition: {
                  delay: index * delay,
                  duration: 0.3,
                },
              },
            }}
          >
            {char}
          </motion.span>
        ))}
      </span>
      <span className='sr-only'>{text}</span>
    </div>
  );
};

export default Brand;
