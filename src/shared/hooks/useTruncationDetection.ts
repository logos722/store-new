import { useEffect, useState, RefObject } from 'react';

/**
 * Хук для определения, обрезан ли текст в элементе (text-overflow: ellipsis)
 *
 * @param ref - React ref элемента для проверки
 * @param text - Текст, который отображается в элементе (для отслеживания изменений)
 * @param deps - Дополнительные зависимости для пересчета (например, размер окна)
 *
 * @returns boolean - true если текст обрезан, false если нет
 *
 * @example
 * const titleRef = useRef<HTMLHeadingElement>(null);
 * const isTruncated = useTruncationDetection(titleRef, product.name);
 */
export const useTruncationDetection = (
  ref: RefObject<HTMLElement>,
  text: string,
  deps: unknown[] = [],
): boolean => {
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    /**
     * Проверяет, обрезан ли текст в элементе
     * Сравнивает scrollWidth (полная ширина контента) с clientWidth (видимая ширина)
     */
    const checkTruncation = () => {
      const element = ref.current;

      if (!element) {
        setIsTruncated(false);
        return;
      }

      // Важно: проверяем с небольшой задержкой, чтобы дать браузеру время
      // применить все CSS стили и правильно рассчитать размеры
      requestAnimationFrame(() => {
        if (!element) return;

        // Получаем computed стили для точной проверки
        const computedStyle = window.getComputedStyle(element);
        const hasEllipsis =
          computedStyle.overflow === 'hidden' &&
          computedStyle.textOverflow === 'ellipsis';

        // Дополнительная проверка для -webkit-line-clamp
        const hasLineClamp =
          computedStyle.display === '-webkit-box' ||
          computedStyle.webkitBoxOrient === 'vertical';

        // Если scrollWidth больше clientWidth, значит текст обрезан
        // Добавляем небольшой допуск (1px) для избежания ложных срабатываний из-за округления
        const truncated = element.scrollWidth > element.clientWidth + 1;

        // Также проверяем высоту для многострочного ellipsis
        const heightTruncated =
          hasLineClamp && element.scrollHeight > element.clientHeight + 1;

        const isTruncatedResult =
          (hasEllipsis || hasLineClamp) && (truncated || heightTruncated);

        setIsTruncated(isTruncatedResult);
      });
    };

    // Проверяем с небольшой задержкой после монтирования
    // Это гарантирует, что все стили применены
    const timeoutId = setTimeout(checkTruncation, 100);

    // Создаем ResizeObserver для отслеживания изменений размера элемента
    // Это важно для адаптивного дизайна
    let resizeObserver: ResizeObserver | null = null;

    // Сохраняем ref.current для cleanup функции
    const currentElement = ref.current;

    if (currentElement && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        checkTruncation();
      });
      resizeObserver.observe(currentElement);
    }

    // Дополнительно слушаем изменение размера окна
    // (fallback для старых браузеров без ResizeObserver)
    window.addEventListener('resize', checkTruncation);

    // Очистка
    return () => {
      clearTimeout(timeoutId);
      if (resizeObserver && currentElement) {
        resizeObserver.unobserve(currentElement);
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', checkTruncation);
    };
  }, [ref, text, ...deps]); // eslint-disable-line react-hooks/exhaustive-deps

  return isTruncated;
};
