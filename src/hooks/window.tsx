import { useEffect, useState, useCallback } from 'react';

const useWindowSize = () => {
  
  const isWindow = typeof window === 'object';
  
  const getSize = useCallback(() => {
    return {
      width: isWindow ? window.innerWidth : undefined,
      height: isWindow ? window.innerHeight : undefined
    };
  }, [isWindow]);
  
  const [size, setSize] = useState(getSize());
  
  useEffect(() => {
    
    if (!isWindow)
      return;
      
    function handleResize() {
      setSize(getSize());
    }
    
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  
  }, [getSize, isWindow]);
  
  return size;

};

export default useWindowSize;
