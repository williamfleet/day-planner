import { useEffect } from 'react';

function useLocalStorage<T>(key: string, value: T) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.log(error);
      }
    }
  }, [key, value]);
}

export default useLocalStorage;
