# Tooltip Component

Переиспользуемый компонент тултипа с поддержкой desktop и mobile устройств.

## Особенности

- ✅ **Умное отображение**: показывается только при необходимости
- 📱 **Мобильная поддержка**: работает через hover на desktop и touch/click на mobile
- 🎯 **Позиционирование**: 4 варианта расположения (top, bottom, left, right)
- ⚡ **Производительность**: легковесный, без внешних зависимостей
- ♿ **Доступность**: поддержка ARIA атрибутов
- 🎨 **Адаптивность**: автоматическая адаптация под размер экрана

## Использование

### Базовый пример

```tsx
import Tooltip from '@/shared/components/ui/Tooltip/Tooltip';

<Tooltip content="Полное описание элемента">
  <span>Краткий текст...</span>
</Tooltip>;
```

### С определением truncation

```tsx
import { useRef } from 'react';
import Tooltip from '@/shared/components/ui/Tooltip/Tooltip';
import { useTruncationDetection } from '@/shared/hooks/useTruncationDetection';

function ProductCard({ product }) {
  const titleRef = useRef(null);
  const isTruncated = useTruncationDetection(titleRef, product.name);

  return (
    <Tooltip content={product.name} disabled={!isTruncated} position="top">
      <h3 ref={titleRef} className={styles.truncatedTitle}>
        {product.name}
      </h3>
    </Tooltip>
  );
}
```

## Props

| Prop        | Тип                                      | По умолчанию | Описание                                                   |
| ----------- | ---------------------------------------- | ------------ | ---------------------------------------------------------- |
| `content`   | `string`                                 | -            | **Обязательный**. Текст тултипа                            |
| `children`  | `ReactNode`                              | -            | **Обязательный**. Элемент, над которым показывается тултип |
| `position`  | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'`      | Позиция тултипа                                            |
| `delay`     | `number`                                 | `300`        | Задержка перед показом (мс)                                |
| `disabled`  | `boolean`                                | `false`      | Отключить тултип                                           |
| `className` | `string`                                 | `''`         | Дополнительный класс для wrapper                           |

## Как работает

### Desktop (hover)

1. Пользователь наводит мышь на элемент
2. После задержки (`delay`) показывается тултип
3. При уходе мыши тултип скрывается

### Mobile (touch)

1. Автоматически определяет touch устройства
2. Показывает тултип по клику
3. Закрывается при клике вне элемента
4. Не мешает основной функциональности (клик на карточку и т.д.)

## Стилизация

Компонент использует CSS модули. Для кастомизации можно:

1. Передать `className` для wrapper
2. Изменить переменные в `Tooltip.module.scss`
3. Переопределить стили через глобальные классы

## Производительность

- Использует `ResizeObserver` для отслеживания изменений размера
- Очищает все слушатели при размонтировании
- Не создает лишних DOM элементов когда тултип скрыт
- Оптимизирован для большого количества экземпляров на странице

## Доступность

- Использует `role="tooltip"` для скрин-ридеров
- Поддерживает `aria-live="polite"` для объявления изменений
- Семантически корректная разметка

## Совместимость

- ✅ React 18+
- ✅ Next.js 14+ (App Router)
- ✅ TypeScript
- ✅ Все современные браузеры
- ✅ iOS Safari
- ✅ Android Chrome

## Best Practices

1. **Используйте с truncation detection**: показывайте тултип только когда это необходимо
2. **Короткий контент**: тултипы предназначены для краткой информации
3. **Не перегружайте**: избегайте тултипов на каждом элементе
4. **Тестируйте на мобильных**: убедитесь что тултип не мешает основному взаимодействию

## Пример с GridProductCard

Смотрите реализацию в `src/shared/components/productCard/GridProductCard.tsx` для полного примера использования с определением truncation.
