import { useState, useEffect } from 'react';
import { CAROUSEL_CONFIG } from '../constants/homeConstants';

export const useCarousel = (totalItems: number) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalGroups = Math.ceil(totalItems / CAROUSEL_CONFIG.GROUP_SIZE);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalGroups);
    }, CAROUSEL_CONFIG.INTERVAL_MS);

    return () => clearInterval(interval);
  }, [totalGroups]);

  const goToSlide = (index: number) => setActiveIndex(index);

  return {
    activeIndex,
    totalGroups,
    goToSlide
  };
};