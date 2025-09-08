import { AnimatePresence, motion } from 'motion/react';
import { Children, useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface RotatingParagraphProps {
  items: React.ReactNode | React.ReactNode[];
  height: string;
  gap?: number;
}

const RotatingParagraph = ({ items, height, gap = 2000 }: RotatingParagraphProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const children = Children.toArray(items);
  const child = children[currentIndex];

  useEffect(() => {
    if (children.length < 2) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % children.length);
    }, gap);
    return () => {
      clearInterval(interval);
    };
  }, [children.length, gap]);

  const variants = {
    enter: { opacity: 0, y: 10 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <div
      data-role='rotating-paragraph'
      className={cn('flex w-full items-center justify-start text-sm lg:text-base', height)}
    >
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentIndex}
          variants={variants}
          initial='enter'
          animate='center'
          exit='exit'
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className='hover:bg-muted relative rounded-lg p-6'
        >
          {child}
          <div className='absolute bottom-2 right-4 text-xs'>
            <a target='_blank' rel='noopener noreferrer' href='/questions-and-answers'>
              More Q&A
            </a>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default RotatingParagraph;
