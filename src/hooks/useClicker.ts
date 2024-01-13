import { useEffect, useState } from 'react';

export type useClickerProps = {
  onSingleClick: Function;
  onDoubleClick: Function;
};

/**
 * useClicker Custom Hook To Handle Both Single & Double Click
 */
const useClicker = ({ onSingleClick, onDoubleClick }: useClickerProps) => {
  const [timeoutId, setTimeoutId] = useState<any>(undefined);

  /**
   * Single Click Handler
   */
  const handleSingleClick = (...args: any) => {
    clearTimeout(timeoutId);
    if (!timeoutId) {
      setTimeoutId(
        setTimeout(() => {
          setTimeoutId(undefined);
          onSingleClick(...args);
        }, 250)
      );
    }
  };
  /**
   * Double Click Handler
   */
  const handleDoubleClick = (...args: any) => {
    setTimeoutId(undefined);
    clearTimeout(timeoutId);
    onDoubleClick(...args);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutId);
  }, [timeoutId]);

  return [handleSingleClick, handleDoubleClick];
};

export default useClicker;
