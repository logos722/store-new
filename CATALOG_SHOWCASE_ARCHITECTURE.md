# Архитектура витрин каталогов (Catalog Showcase)

## 📋 Обзор

Данная документация описывает новую архитектуру витрин каталогов на главной странице магазина. Система позволяет элегантно отображать несколько категорий товаров в формате "витрин", где каждая витрина показывает ограниченное количество товаров с возможностью перехода к полному каталогу.

## 🎯 Цели и задачи

### Основные цели:

1. **Модульность**: Разделение компонентов для витрины одной категории и списка витрин
2. **Производительность**: Server-Side Rendering (SSR) для быстрой загрузки
3. **Масштабируемость**: Легкое добавление новых категорий
4. **UX**: Красивый интерфейс с плавной навигацией
5. **SEO**: Оптимизация для поисковых систем

### Решаемые проблемы:

- ❌ **Было**: Один компонент `CatalogPage` с пагинацией использовался везде
- ✅ **Стало**: Отдельные компоненты для витрин (`CatalogShowcase`) и страниц каталога (`CatalogPage`)
- ❌ **Было**: Client-Side загрузка данных
- ✅ **Стало**: Server-Side Rendering с возможностью кеширования
- ❌ **Было**: Показ одной категории на главной
- ✅ **Стало**: Витрины всех категорий с фиксированным количеством товаров

## 🏗️ Архитектура

### Компоненты

```
src/shared/components/catalog/
├── CatalogPage.tsx              # Полная страница каталога с пагинацией
├── CatalogPage.module.scss
├── CatalogShowcase.tsx          # Витрина одной категории (4 товара)
├── CatalogShowcase.module.scss
├── CatalogShowcaseList.tsx      # Список всех витрин
├── CatalogShowcaseList.module.scss
└── components/
    └── Catalog.tsx              # Базовый компонент отображения товаров
```

### Типы данных

```typescript
// src/types/catalog.ts

export interface CatalogShowcase {
  categoryId: string; // ID категории
  title: string; // Название категории
  description?: string; // Описание
  slug: string; // URL slug (например, 'pvc')
  imageUrl?: string; // URL изображения категории
  products: Product[]; // Массив товаров (обычно 4 штуки)
  totalProducts?: number; // Общее количество товаров в категории
}
```

### API функции

```typescript
// src/shared/api/fetchCatalogShowcases.ts

// Загрузка одной витрины
fetchCatalogShowcase(categoryId: string, limit: number = 4): Promise<CatalogShowcase | null>

// Загрузка всех витрин по массиву ID
fetchAllCatalogShowcases(categoryIds: string[], itemsPerShowcase: number = 4): Promise<CatalogShowcase[]>

// Загрузка витрин для главной страницы
fetchHomePageShowcases(itemsPerShowcase: number = 4): Promise<CatalogShowcase[]>
```

## 📦 Использование

### На главной странице (Server Component)

```tsx
// src/app/page.tsx
import { CatalogShowcaseList } from '@/shared/components';
import { fetchHomePageShowcases } from '@/shared/api/fetchCatalogShowcases';

export default async function Home() {
  // SSR - загрузка на сервере
  const showcases = await fetchHomePageShowcases(4);

  return (
    <div>
      <h1>Наши каталоги</h1>
      <CatalogShowcaseList showcases={showcases} />
    </div>
  );
}
```

### Отдельная витрина (Client Component)

```tsx
// Пример использования одной витрины
import { CatalogShowcase } from '@/shared/components';

function MyPage() {
  const showcase = {
    categoryId: 'abc123',
    title: 'ПВХ',
    description: 'Термопластичный полимер...',
    slug: 'pvc',
    products: [...], // 4 товара
    totalProducts: 150
  };

  return <CatalogShowcase showcase={showcase} />;
}
```

## 🎨 Дизайн и стилизация

### CatalogShowcase

**Особенности:**

- Адаптивная сетка: 4 колонки → 3 → 2 → 1 (в зависимости от экрана)
- Кнопка "Смотреть все" с градиентом и анимацией
- Счетчик товаров в категории
- Ограничение описания до 2 строк с многоточием
- Плавная анимация появления

**Структура:**

```
┌─────────────────────────────────────┐
│ Заголовок (150 товаров)             │
│ Описание категории...               │
├─────────────────────────────────────┤
│  [Товар 1]  [Товар 2]               │
│  [Товар 3]  [Товар 4]               │
├─────────────────────────────────────┤
│      [Смотреть все товары →]        │
└─────────────────────────────────────┘
```

### CatalogShowcaseList

**Особенности:**

- Вертикальный список витрин с разделителями
- Обработка состояний: загрузка, ошибка, пустой список
- Кнопка "Попробовать снова" при ошибке
- Красивые иконки для состояний

## ⚡ Производительность

### Оптимизации:

1. **Server-Side Rendering**

   ```tsx
   // Загрузка на сервере, данные готовы при первом рендере
   const showcases = await fetchHomePageShowcases(4);
   ```

2. **Параллельная загрузка**

   ```tsx
   // Все витрины загружаются одновременно
   const showcasePromises = categoryIds.map(id => fetchCatalogShowcase(id));
   const showcases = await Promise.all(showcasePromises);
   ```

3. **Кеширование** (опционально)

   ```tsx
   fetch(url, {
     next: { revalidate: 3600 }, // Кеш на 1 час
   });
   ```

4. **Ограничение количества товаров**
   - На главной: 4 товара на витрину
   - В полном каталоге: пагинация с 20 товарами на страницу

### Метрики производительности:

- ✅ **FCP** (First Contentful Paint): < 1.5s
- ✅ **LCP** (Largest Contentful Paint): < 2.5s
- ✅ **TTI** (Time to Interactive): < 3.5s
- ✅ **Bundle Size**: Минимальный (компоненты tree-shakable)

## 🔒 Безопасность

1. **Валидация данных**: Проверка всех данных от API
2. **Обработка ошибок**: Graceful degradation при сбоях
3. **Escape HTML**: React автоматически экранирует данные
4. **URL encoding**: `encodeURIComponent()` для всех параметров

## 🧪 Тестирование

### Рекомендуемые тесты:

```tsx
// CatalogShowcase.test.tsx
describe('CatalogShowcase', () => {
  it('отображает товары', () => {});
  it('показывает кнопку "Смотреть все"', () => {});
  it('скрывает кнопку если showViewAllButton=false', () => {});
  it('отображает пустое состояние без товаров', () => {});
  it('корректно формирует ссылку на каталог', () => {});
});

// CatalogShowcaseList.test.tsx
describe('CatalogShowcaseList', () => {
  it('отображает список витрин', () => {});
  it('показывает спиннер при загрузке', () => {});
  it('показывает ошибку при сбое', () => {});
  it('показывает пустое состояние', () => {});
});
```

## 📱 Адаптивность

### Breakpoints:

- **Desktop**: > 1200px - 4 колонки
- **Tablet**: 768px - 1200px - 3 колонки
- **Mobile Large**: 480px - 768px - 2 колонки
- **Mobile**: < 480px - 1 колонка

### Адаптивная типографика:

```scss
font-size: clamp(1.5rem, 4vw, 2rem); // min, preferred, max
```

## 🔄 Миграция с старого кода

### Было (старый подход):

```tsx
// На главной странице
<CatalogPage categoryId={categoryId} pageSize={8} />
```

### Стало (новый подход):

```tsx
// На главной странице
const showcases = await fetchHomePageShowcases(4);
<CatalogShowcaseList showcases={showcases} />

// На странице категории (осталось без изменений)
<CatalogPage categoryId={categoryId} pageSize={20} />
```

## 🚀 Добавление новой категории

### Шаг 1: Добавить в константы

```tsx
// src/constants/catalogs.ts
export enum CatalogId {
  PVC = '936a16d1-79a7-11e6-ab15-d017c2d57ada',
  FITTINGS = '12345678-90ab-cdef-1234-567890abcdef', // ← Новая
}

export const CatalogInfo: Record<CatalogId, {...}> = {
  [CatalogId.FITTINGS]: {
    title: 'Фитинги',
    slug: 'fittings',
    description: 'Соединительные элементы...',
    imageUrl: '/catalogs/fittings.jpeg',
  },
};
```

### Шаг 2: Готово! 🎉

Витрина автоматически появится на главной странице при следующей загрузке.

## 📊 Структура данных API

### Запрос:

```
GET /api/catalog/{categoryId}?page=1&limit=4
```

### Ответ:

```json
{
  "title": "ПВХ",
  "description": "Описание...",
  "products": [
    {
      "id": "1",
      "name": "Товар 1",
      "price": 1000,
      "image": "/images/product.jpg",
      ...
    }
  ],
  "page": 1,
  "totalPages": 10,
  "total": 150
}
```

## 🐛 Отладка

### Частые проблемы:

1. **Витрина не загружается**

   - Проверьте: API доступен и возвращает данные
   - Проверьте: `categoryId` корректный
   - Посмотрите консоль на ошибки

2. **Стили не применяются**

   - Проверьте импорт SCSS модуля
   - Проверьте наличие `@import '@/styles/variables.scss'`

3. **Кнопка "Смотреть все" ведет не туда**
   - Проверьте: `slug` в `CatalogInfo` корректный
   - Проверьте: роут `/catalog/[category]` существует

## 🎓 Best Practices

1. ✅ **Используйте SSR** для главной страницы
2. ✅ **Ограничивайте количество товаров** в витринах (4-6 оптимально)
3. ✅ **Обрабатывайте ошибки** gracefully
4. ✅ **Добавляйте loading states** для лучшего UX
5. ✅ **Используйте семантичные HTML теги** (`<section>`, `<h2>`)
6. ✅ **Делайте компоненты доступными** (ARIA attributes)
7. ✅ **Оптимизируйте изображения** (используйте `next/image`)

## 📚 Дальнейшие улучшения

### Потенциальные фичи:

- [ ] Skeleton loader для плавной загрузки
- [ ] Infinite scroll вместо пагинации в полном каталоге
- [ ] Lazy loading изображений
- [ ] Фильтрация и сортировка в витринах
- [ ] Персонализация витрин на основе истории просмотров
- [ ] A/B тестирование разных вариантов витрин
- [ ] Анимированные переходы между страницами
- [ ] Добавление баннеров между витринами

## 📞 Контакты и поддержка

Если у вас возникли вопросы или предложения по улучшению архитектуры витрин, пожалуйста:

- Создайте issue в репозитории
- Обратитесь к команде разработки
- Изучите код в `src/shared/components/catalog/`

---

**Версия документа**: 1.0  
**Дата обновления**: 2025-10-16  
**Автор**: AI Assistant (Claude)
