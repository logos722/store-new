import { useState, useEffect } from 'react';

/**
 * Хук возвращает значение `value`, которое обновится только спустя `delay` мс после последнего изменения `value`.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // при изменении `value` или `delay` очищаем предыдущий таймаут
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
