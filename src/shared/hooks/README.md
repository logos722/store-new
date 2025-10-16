# Custom Hooks

Переиспользуемые React хуки для приложения.

## useTruncationDetection

Хук для определения, обрезан ли текст в элементе (когда активен `text-overflow: ellipsis`).

### Использование

```tsx
import { useRef } from 'react';
import { useTruncationDetection } from '@/shared/hooks/useTruncationDetection';

function ProductCard({ product }) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const isTruncated = useTruncationDetection(titleRef, product.name);

  return (
    <div>
      <h3 ref={titleRef} className={styles.truncatedTitle}>
        {product.name}
      </h3>
      {isTruncated && <Tooltip content={product.name}>...</Tooltip>}
    </div>
  );
}
```

### Параметры

```typescript
useTruncationDetection(
  ref: RefObject<HTMLElement>,    // Ref элемента для проверки
  text: string,                   // Текст для отслеживания изменений
  deps?: any[]                    // Дополнительные зависимости
): boolean                        // true если текст обрезан
```

### Как работает

1. **Сравнение размеров**: сравнивает `scrollWidth` (полная ширина) с `clientWidth` (видимая ширина)
2. **ResizeObserver**: автоматически пересчитывает при изменении размера элемента
3. **Window resize**: fallback для старых браузеров без ResizeObserver
4. **Оптимизация**: очищает все слушатели при размонтировании

### Когда использовать

- ✅ Для элементов с `text-overflow: ellipsis`
- ✅ Когда нужно показать тултип только для длинного текста
- ✅ Для адаптивного дизайна с изменяющимися размерами
- ✅ Для улучшения UX (не показывать лишние тултипы)

### Производительность

- Использует нативный `ResizeObserver` API
- Минимальные пересчеты при изменении размеров
- Не создает лишних DOM элементов
- Корректно очищает все слушатели

### Пример с CSS

```scss
.truncatedTitle {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* количество строк */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### Edge Cases

✅ **Обрабатывается корректно:**

- Элемент не существует (ref.current === null)
- Изменение размера окна
- Изменение размера контейнера
- Изменение текста
- Смена ориентации устройства
- Размонтирование компонента

### Совместимость

- ✅ React 18+
- ✅ TypeScript
- ✅ ResizeObserver (современные браузеры)
- ⚠️ Fallback на window.resize для старых браузеров

## useSEO

(Существующий хук - см. документацию в соответствующем файле)

## useNotification

(Существующий хук - см. `src/hooks/useNotification.ts`)
