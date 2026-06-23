import { useState, useCallback } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const next = value instanceof Function ? value(storedValue) : value;
        setStoredValue(next);
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch (e) {
        console.warn(`useLocalStorage: failed to set "${key}"`, e);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (e) {
      console.warn(`useLocalStorage: failed to remove "${key}"`, e);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};
