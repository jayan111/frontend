import { useEffect, useState } from 'react';

export const useWindowSize = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    let rafId;
    const handler = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setSize({ width: window.innerWidth, height: window.innerHeight });
      });
    };

    window.addEventListener('resize', handler, { passive: true });
    return () => {
      window.removeEventListener('resize', handler);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return {
    ...size,
    isMobile:  size.width < 768,
    isTablet:  size.width >= 768 && size.width < 1024,
    isDesktop: size.width >= 1024,
  };
};
