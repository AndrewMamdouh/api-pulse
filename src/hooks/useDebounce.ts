import { useRef, useEffect } from 'react';

type Timer = ReturnType<typeof setTimeout>;
type Action =
  /**
   *  Action Function Type
   */
  (...args: any[]) => void;

/**
 *  useDebounce Custom Hook To Trigger An Update After Amount Of Time
 */
const useDebounce = (action: Action, delay = 1000) => {
  const timer = useRef<Timer>();

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    return () => clearTimeout(timer.current);
  }, []);

  /**
   *  Delayed Action (Debounced Action)
   */
  const debouncedAction = (...args: any[]) => {
    clearTimeout(timer.current);
    const newTimer = setTimeout(() => {
      action(...args);
    }, delay);
    timer.current = newTimer;
  };

  return debouncedAction;
};

export default useDebounce;
