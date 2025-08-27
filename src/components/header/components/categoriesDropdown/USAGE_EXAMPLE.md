# CategoriesDropdown - Пример использования

## Базовое использование

```tsx
import CategoriesDropdown from '@/components/header/components/categoriesDropdown/CategoriesDropdown';

// Пример 1: Простая структура с вложенным объектом (как в вашем примере)
const simpleCategories = [
  {
    id: '1',
    name: 'Каталог',
    nestedObject: {
      id: '3',
      name: 'ПВХ',
      link: '/catalog/936a16d1-79a7-11e6-ab15-d017c2d57ada',
    },
  },
  {
    id: '2',
    name: 'Статьи',
    link: '/articles',
  },
];

<CategoriesDropdown
  categories={simpleCategories}
  defaultInteractionType="hover" // hover по умолчанию
/>;
```

## Расширенные примеры

### Пример 2: Многоуровневая структура с children

```tsx
const complexCategories = [
  {
    id: '1',
    name: 'Каталог',
    children: [
      {
        id: '1-1',
        name: 'ПВХ трубы',
        link: '/catalog/pvc-pipes',
        children: [
          {
            id: '1-1-1',
            name: 'Диаметр 20мм',
            link: '/catalog/pvc-pipes/20mm',
          },
          {
            id: '1-1-2',
            name: 'Диаметр 32мм',
            link: '/catalog/pvc-pipes/32mm',
          },
        ],
      },
      {
        id: '1-2',
        name: 'Фитинги',
        link: '/catalog/fittings',
        children: [
          {
            id: '1-2-1',
            name: 'Муфты',
            link: '/catalog/fittings/couplings',
          },
          {
            id: '1-2-2',
            name: 'Переходники',
            link: '/catalog/fittings/adapters',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Статьи',
    link: '/articles',
  },
];

<CategoriesDropdown
  categories={complexCategories}
  defaultInteractionType="hover"
/>;
```

### Пример 3: Смешанная структура (children + nestedObject)

```tsx
const mixedCategories = [
  {
    id: '1',
    name: 'Каталог',
    children: [
      {
        id: '1-1',
        name: 'ПВХ системы',
        nestedObject: {
          id: '1-1-1',
          name: 'ПВХ трубы',
          link: '/catalog/pvc-pipes',
        },
      },
      {
        id: '1-2',
        name: 'Металлопластик',
        link: '/catalog/metal-plastic',
      },
    ],
  },
  {
    id: '2',
    name: 'Инструменты',
    link: '/tools',
  },
];

<CategoriesDropdown
  categories={mixedCategories}
  defaultInteractionType="both" // поддержка и hover и click
/>;
```

### Пример 4: Индивидуальные типы взаимодействия

```tsx
const customInteractionCategories = [
  {
    id: '1',
    name: 'Каталог',
    interactionType: 'click', // только клик для этой категории
    children: [
      {
        id: '1-1',
        name: 'ПВХ',
        interactionType: 'hover', // только hover для этой подкатегории
        link: '/catalog/pvc',
      },
    ],
  },
  {
    id: '2',
    name: 'Статьи',
    interactionType: 'both', // и hover и click
    nestedObject: {
      id: '2-1',
      name: 'Новости',
      link: '/articles/news',
    },
  },
];

<CategoriesDropdown
  categories={customInteractionCategories}
  defaultInteractionType="hover" // глобальный дефолт
/>;
```

## Типы взаимодействий

- **hover**: Подменю открывается при наведении мыши
- **click**: Подменю открывается только при клике
- **both**: Подменю открывается и при наведении, и при клике

## Адаптивность

Компонент автоматически адаптируется под мобильные устройства:

- На десктопе: боковые подменю (submenu справа)
- На мобильных (< 768px): вертикальные подменю (submenu снизу)
- На очень маленьких экранах (< 480px): уменьшенные отступы

## Основные возможности

✅ **Рекурсивная вложенность**: неограниченное количество уровней  
✅ **Гибкие взаимодействия**: hover, click, both  
✅ **Смешанные структуры**: children + nestedObject  
✅ **Адаптивный дизайн**: desktop + mobile  
✅ **Обработка ошибок**: валидация данных  
✅ **Производительность**: мемоизация + оптимизация  
✅ **Accessibility**: поддержка клавиатуры и screen readers

## Структура данных

```typescript
interface Category {
  id: string; // уникальный идентификатор (обязательный)
  name: string; // название категории (обязательный)
  link?: string; // ссылка для конечной категории
  children?: Category[]; // массив подкатегорий
  nestedObject?: Category; // одиночный вложенный объект
  interactionType?: 'hover' | 'click' | 'both'; // тип взаимодействия
}
```

## Обработка ошибок

Компонент автоматически:

- Фильтрует невалидные категории
- Предотвращает бесконечную вложенность (максимум 6 уровней)
- Логирует предупреждения в консоль при проблемах с данными
- Показывает fallback UI при отсутствии категорий
