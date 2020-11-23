import { useEffect, useState, useRef } from 'react';
import useMedia from './media';

function useSticky(props?: { delay?: number }) {

  props = {
    delay: 100, // the debounce delay.
    ...props
  };

  const { delay } = props;

  const { isMobileBreak } = useMedia();
  const [isSticky, setSticky] = useState(false);
  const parent = useRef(null);

  const handleScroll = () => {

    if (!parent || !parent.current)
      return setSticky(false);

    const scrollY = window.scrollY;
    const bottom = parent.current.getBoundingClientRect().bottom;

    if (scrollY > bottom || (scrollY < bottom && scrollY > 0)) {
      setSticky(true);
    }
    else {
      setSticky(false);
    }

  }


  const debounce = (callback, time) => {
    let interval;
    return (...args) => {
      clearTimeout(interval);
      interval = setTimeout(() => {
        interval = null;
        callback(...args);
      }, time);
    };
  };

  useEffect(() => {

    let handler;

    if (!isMobileBreak) {
      handler = debounce(handleScroll, delay);
      window.addEventListener("scroll", handler);
    }

    return () => {
      if (handler)
        window.removeEventListener("scroll", handler);
    };

  }, [debounce, handleScroll]);

  return { isSticky, parent };

}

export default useSticky;


    // if (window.scrollY === 0) {
    //   setTimeout(() => {
    //     setSticky(false);

    //   }, 10)
    // }
    // else if (diff > 0) {
    //   setTimeout(() => {
    //     setSticky(true);
    //   }, 100)
    // }
    // if (bottom > scrollY) {

    // }
    // else {
    // window.scrollY > parent.current.getBoundingClientRect().bottom
    //   ? setSticky(false)
    //   : setSticky(true);