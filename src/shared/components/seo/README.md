# SEO Компоненты

Этот каталог содержит все компоненты и утилиты для SEO оптимизации приложения.

## 🧩 Компоненты

### `SEOHead.tsx`

**Для клиентских компонентов** (`'use client'`)

Универсальный компонент для управления метаданными страницы.

```tsx
import SEOHead from '@/shared/components/seo/SEOHead';

<SEOHead
  title="Заголовок страницы"
  description="Описание страницы"
  keywords="ключевые, слова"
  image="/images/og-image.jpg"
  canonicalUrl="/current-page"
  noindex={false}
  nofollow={false}
  structuredData={schemaData}
/>;
```

**Особенности:**

- Поддержка Open Graph и Twitter Cards
- Автоматическая генерация канонических URL
- Управление индексацией поисковиками
- Интеграция структурированных данных
- Preconnect и DNS prefetch

### `ServerStructuredData.tsx`

**Для серверных компонентов**

Компонент для вставки структурированных данных в серверных компонентах.

```tsx
import ServerStructuredData from '@/shared/components/seo/ServerStructuredData';
import { ServerStructuredDataGenerator } from '@/shared/utils/structuredData';

const schema = ServerStructuredDataGenerator.generateOrganizationSchema();

<ServerStructuredData data={schema} />;
```

### `StructuredData.tsx`

**Для клиентских компонентов** (`'use client'`)

Компонент для вставки структурированных данных в клиентских компонентах.

```tsx
import StructuredData, {
  StructuredDataGenerator,
} from '@/shared/components/seo/StructuredData';

const schema = StructuredDataGenerator.generateProductSchema(product);

<StructuredData data={schema} />;
```

### `Breadcrumbs.tsx`

**Универсальный компонент**

SEO-оптимизированные хлебные крошки с поддержкой структурированных данных.

```tsx
import Breadcrumbs from '@/shared/components/seo/Breadcrumbs';

// Автоматическая генерация на основе URL
<Breadcrumbs />

// Или с кастомными элементами
<Breadcrumbs items={[
  { name: 'Главная', href: '/' },
  { name: 'Каталог', href: '/catalog' },
  { name: 'Текущая страница', href: '/current', current: true }
]} />
```

## 🛠 Утилиты

### `useSEO.ts`

Хук для генерации SEO данных.

```tsx
import useSEO from '@/shared/hooks/useSEO';

const {
  homePageSEO,
  productPageSEO,
  categoryPageSEO,
  favoritesPageSEO,
  cartPageSEO,
  articlesPageSEO,
} = useSEO();

// Для товара
const seoData = productPageSEO(product);

// Для категории
const seoData = categoryPageSEO('Сантехника', 150);

// Для избранного
const seoData = favoritesPageSEO(favoriteCount);
```

### `structuredData.ts`

Серверные утилиты для генерации Schema.org разметки.

```tsx
import { ServerStructuredDataGenerator } from '@/shared/utils/structuredData';

const organizationSchema =
  ServerStructuredDataGenerator.generateOrganizationSchema();
const productSchema =
  ServerStructuredDataGenerator.generateProductSchema(product);
const breadcrumbSchema =
  ServerStructuredDataGenerator.generateBreadcrumbSchema(items);
```

## 📋 Примеры использования

### Серверный компонент (App Router)

```tsx
// app/page.tsx
import { Metadata } from 'next';
import ServerStructuredData from '@/shared/components/seo/ServerStructuredData';
import { ServerStructuredDataGenerator } from '@/shared/utils/structuredData';
import { generateHomeMetadata } from '@/shared/utils/seo';

export const metadata: Metadata = generateHomeMetadata();

export default async function HomePage() {
  const organizationSchema =
    ServerStructuredDataGenerator.generateOrganizationSchema();
  const websiteSchema = ServerStructuredDataGenerator.generateWebsiteSchema();

  return (
    <>
      <ServerStructuredData data={[organizationSchema, websiteSchema]} />
      {/* Контент страницы */}
    </>
  );
}
```

### Клиентский компонент

```tsx
'use client';

import SEOHead from '@/shared/components/seo/SEOHead';
import StructuredData, {
  StructuredDataGenerator,
} from '@/shared/components/seo/StructuredData';
import Breadcrumbs from '@/shared/components/seo/Breadcrumbs';
import useSEO from '@/shared/hooks/useSEO';

export default function ProductPage({ product }) {
  const { productPageSEO } = useSEO();
  const seoData = productPageSEO(product);
  const productSchema = StructuredDataGenerator.generateProductSchema(product);

  return (
    <>
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        image={seoData.image}
        canonicalUrl={`/product/${product.slug}`}
        structuredData={productSchema}
      />

      <StructuredData data={productSchema} />
      <Breadcrumbs />

      {/* Контент товара */}
    </>
  );
}
```

### Страница с динамическими SEO данными

```tsx
'use client';

import { useState, useEffect } from 'react';
import SEOHead from '@/shared/components/seo/SEOHead';
import useSEO from '@/shared/hooks/useSEO';

export default function FavoritesPage() {
  const [favoriteCount, setFavoriteCount] = useState(0);
  const { favoritesPageSEO } = useSEO();

  // Получаем актуальные данные
  useEffect(() => {
    // Логика получения количества избранных товаров
  }, []);

  const seoData = favoritesPageSEO(favoriteCount);

  return (
    <>
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        noindex={seoData.noindex}
        nofollow={seoData.nofollow}
      />

      {/* Контент страницы */}
    </>
  );
}
```

## 🎯 Рекомендации

### Когда использовать SEOHead?

✅ **Используйте SEOHead когда:**

- Компонент помечен `'use client'`
- Нужны динамические метаданные (зависят от состояния)
- Требуется сложная логика генерации SEO данных
- Нужна интеграция со структурированными данными

❌ **Не используйте SEOHead когда:**

- Компонент серверный (используйте Metadata API)
- Метаданные статичны и не изменяются
- Можно обойтись стандартным `export const metadata`

### Приоритет SEO решений

1. **Серверные компоненты**: `export const metadata` + `ServerStructuredData`
2. **Клиентские компоненты**: `SEOHead` + `StructuredData`
3. **Динамический контент**: `useSEO` хук + `SEOHead`

### Структурированные данные

- **Серверные компоненты**: `ServerStructuredDataGenerator` + `ServerStructuredData`
- **Клиентские компоненты**: `StructuredDataGenerator` + `StructuredData`

## 🔧 Настройка

### Переменные окружения

```env
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### Next.js конфигурация

Убедитесь, что в `next.config.js` настроены:

- Оптимизация изображений
- Сжатие
- Кэширование заголовков
- Правильные редиректы

## 📚 Дополнительные ресурсы

- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Schema.org](https://schema.org/)
- [Google Rich Results](https://developers.google.com/search/docs/appearance/structured-data)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
