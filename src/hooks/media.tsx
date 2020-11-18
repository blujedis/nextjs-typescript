
import { useCallback, useState, useEffect } from 'react';

const useMatchMedia = (query: string) => {

  const [match, setMatch] = useState(false);
  const canMatch = typeof window === 'object' && typeof window.matchMedia === 'function';

  const queryMedia = useCallback(() => {
    const queryList = window.matchMedia(query);
    setMatch((queryList && queryList.matches) || false);
    return queryList;
  }, [canMatch]);

  useEffect(() => {
    if (!canMatch)
      return;
    const queryList = queryMedia();
    // if (queryList)
    //   queryList.addListener(queryMedia);
    if (queryList)
      queryList.addEventListener('change', queryMedia);
    return () => queryList && queryList.removeEventListener('change', queryMedia);
  }, [queryMedia, canMatch]);

  return match;

};

export { useMatchMedia };

const useMedia = () => {

  // Break Points

  const breakMobile = useMatchMedia('(max-width: 768px)');
  const breakTablet = useMatchMedia('(min-width: 769px) and (max-width: 1023px)');
  const breakDesktop = useMatchMedia('(min-width: 1024px) and (max-width: 1215px)');
  const breakWide = useMatchMedia('(min-width: 1216px) and (max-width: 1407px)');
  const breakFull = useMatchMedia('(min-width: 1408px)');

  // Orientation

  const isPortrait = useMatchMedia('(orientation: portrait)');
  const isRetina = useMatchMedia('(min-resolution: 2dppx)');

  // Helpers  

  const isMobileBreak = breakMobile || breakTablet;

  return {
    breakMobile,
    breakTablet,
    breakDesktop,
    breakWide,
    breakFull,
    isPortrait,
    isRetina,
    isMobileBreak
  };

};

export default useMedia;

