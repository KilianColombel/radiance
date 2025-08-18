import { useState, useEffect } from 'react';

export function useResponsivePanels() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const minSizePixels = 100;
  const maxSizePixels = 300;
  const defaultSizePixels = 200;
  const collapsedSizePixels = 50;

  return {
    minSizePercentage: (minSizePixels / width) * 100,
    maxSizePercentage: (maxSizePixels / width) * 100,
    defaultSizePercentage: (defaultSizePixels / width) * 100,
    collapsedSizePercentage: (collapsedSizePixels / width) * 100,
  };
}