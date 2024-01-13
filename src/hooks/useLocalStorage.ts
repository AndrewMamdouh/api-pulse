import { useCallback, useState } from 'react';

/**
 * useLocalStorage Custom Hook To Handle Local Storage Operations
 */
const useLocalStorage = () => {
  const [value, setValue] = useState<string | null>(null);

  /**
   * Create Item In Local Storage
   */
  const setItem = useCallback((key: string, value: string) => {
    localStorage.setItem(key, value);
    setValue(value);
  }, []);

  /**
   * Get Item From Local Storage
   */
  const getItem = useCallback((key: string) => {
    const value = localStorage.getItem(key);
    setValue(value);
    return value;
  }, []);

  /**
   * Remove Item From Local Storage
   */
  const removeItem = useCallback((key: string) => {
    localStorage.removeItem(key);
    setValue(null);
  }, []);

  return { value, setItem, getItem, removeItem };
};

export default useLocalStorage;
