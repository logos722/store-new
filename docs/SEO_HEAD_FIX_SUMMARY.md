# Исправление SEOHead компонента для Next.js App Router

## Проблема

`SEOHead.tsx` использовал `next/head`, который **НЕ работает** в Next.js 13+ App Router. Это приводило к тому, что:
- ❌ Title страницы не обновлялся
- ❌ Мета-теги не обновлялись
- ❌ Open Graph и Twitter Cards не работали

## Причина

В Next.js App Router (13+):
- `next/head` — устаревший компонент из Pages Router
- Для клиентских компонентов нужно использовать прямые манипуляции DOM
- Для серверных компонентов — Metadata API (`generateMetadata`)

## Решение

Переписан `SEOHead.tsx` для работы через `useEffect` с прямыми манипуляциями DOM:

```typescript
'use client';
import { useEffect } from 'react';

const SEOHead: React.FC<SEOProps> = ({ title, description, ... }) => {
  useEffect(() => {
    // Обновляем title
    document.title = fullTitle;
    
    // Обновляем мета-теги
    updateMetaTag('meta[name="description"]', 'content', description);
    // ... и так далее
  }, [title, description, ...]);

  return null; // Компонент ничего не рендерит
};
```

## Что было изменено

### До (не работало):
```typescript
return (
  <Head>
    <title>{fullTitle}</title>
    <meta name="description" content={description} />
  </Head>
);
```

### После (работает):
```typescript
useEffect(() => {
  document.title = fullTitle;
  updateMetaTag('meta[name="description"]', 'content', description);
  // ...
}, [title, description, ...]);

return null;
```

## Преимущества нового подхода

✅ **Работает в App Router** — совместим с Next.js 13+  
✅ **Динамическое обновление** — мета-теги обновляются при изменении данных  
✅ **Полная поддержка SEO** — Open Graph, Twitter Cards, структурированные данные  
✅ **Клиентский рендеринг** — работает с React Query и динамическими данными  

## Использование

Ничего не изменилось в API компонента:

```tsx
<SEOHead
  title={seoData.title}
  description={seoData.description}
  keywords={seoData.keywords}
  image={seoData.image}
  canonicalUrl={`/product/${product.slug}`}
  structuredData={productSchema}
/>
```

## Ограничения

⚠️ **Важно:** Этот подход работает только на клиенте!

- Мета-теги обновляются после загрузки страницы
- Для SSR/SSG используйте `generateMetadata` (см. рекомендации ниже)

## Рекомендации для оптимизации

### Вариант 1: Текущий подход (клиентский)
✅ Подходит для страниц с динамическими данными (React Query)  
✅ Простой в использовании  
⚠️ Мета-теги обновляются после загрузки

### Вариант 2: Серверные компоненты + generateMetadata (рекомендуется для SEO)
✅ Мета-теги в HTML при первой загрузке  
✅ Лучше для SEO  
✅ Работает с SSR/SSG  
⚠️ Требует рефакторинга страниц

## Пример миграции на generateMetadata (опционально)

Если вы хотите улучшить SEO, можно мигрировать страницы на серверные компоненты:

```typescript
// app/product/[id]/page.tsx (серверный компонент)
import { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await fetchProduct(params.id);
  
  return {
    title: `${product.name} | Гелион`,
    description: `${product.description}. Цена: ${product.price} ₽`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }) {
  const product = await fetchProduct(params.id);
  return <ProductPageClient product={product} />;
}
```

## Проверка работы

1. Откройте страницу продукта в браузере
2. Проверьте `document.title` в консоли — должен быть корректным
3. Откройте DevTools → Elements → `<head>` — мета-теги должны быть обновлены
4. Проверьте в консоли: `SEO обновлен: { title: "...", ... }`

## Дополнительные ресурсы

- [Next.js Metadata Documentation](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js App Router Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration)

---

**Дата исправления:** 17 ноября 2025  
**Файлы изменены:** `src/shared/components/seo/SEOHead.tsx`


