import React, { useEffect } from 'react';

/**
 * Custom hook to detect clicks outside of a specified element.
 * Don't forget to use `setFlag(false)` after reading the flag.
 */
const useOutsideClick = (ref: React.RefObject<HTMLDivElement | null>) => {
  const [flag, setFlag] = React.useState(false);

  useEffect(() => {
    const listener = (event: PointerEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      setFlag(true);
    };

    document.addEventListener('pointerdown', listener);

    return () => {
      document.removeEventListener('pointerdown', listener);
    };
  }, [ref]);

  return { clickOutside: flag, resetClickOutside: setFlag };
};

export default useOutsideClick;
