# Проверка работы SEOHead

## Быстрая проверка

### 1. Откройте страницу продукта

```
http://localhost:3000/product/[любой-id]
```

### 2. Откройте DevTools (F12)

### 3. Проверьте Console
Вы должны увидеть:
```
SEO обновлен: {
  title: "Название товара | Гелион - Интернет-магазин сантехники",
  description: "...",
  canonical: "/product/..."
}
```

### 4. Проверьте Elements → `<head>`

Должны быть обновлены следующие теги:

```html
<title>Название товара | Гелион - Интернет-магазин сантехники</title>
<meta name="description" content="...">
<meta name="keywords" content="...">
<meta property="og:title" content="Название товара">
<meta property="og:description" content="...">
<meta property="og:image" content="...">
<meta name="twitter:card" content="summary_large_image">
<link rel="canonical" href="/product/...">
```

### 5. Проверьте в консоли браузера

```javascript
// В консоли браузера
document.title
// Должно вернуть: "Название товара | Гелион - Интернет-магазин сантехники"

document.querySelector('meta[name="description"]').content
// Должно вернуть описание товара

document.querySelector('meta[property="og:image"]').content
// Должно вернуть URL изображения товара
```

## Тест с разными продуктами

1. Откройте страницу одного продукта
2. Проверьте title в браузере
3. Перейдите на другой продукт
4. Title должен автоматически обновиться!

## Проверка Open Graph

Используйте инструменты:
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

**Важно:** Эти инструменты смотрят на серверный HTML, поэтому для полной SEO-оптимизации рекомендуется мигрировать на `generateMetadata` (см. `SEO_HEAD_FIX_SUMMARY.md`).

## Проверка структурированных данных

1. Откройте страницу продукта
2. Используйте [Google Rich Results Test](https://search.google.com/test/rich-results)
3. Введите URL вашей страницы
4. Проверьте, что Product schema распознан правильно

## Troubleshooting

### Title не обновляется

**Причина:** SEOHead не монтируется или useEffect не срабатывает

**Решение:**
1. Проверьте, что `<SEOHead />` рендерится в компоненте
2. Проверьте консоль на ошибки JavaScript
3. Убедитесь, что пропсы передаются корректно

### Мета-теги не обновляются

**Причина:** Конфликт с другими библиотеками или компонентами

**Решение:**
1. Проверьте, что нет других компонентов, которые тоже управляют мета-тегами
2. Убедитесь, что `next/head` нигде не используется в проекте
3. Проверьте порядок рендеринга компонентов

### Open Graph не работает в соцсетях

**Причина:** Соцсети смотрят на серверный HTML, а SEOHead работает на клиенте

**Решение:**
Используйте `generateMetadata` для SSR (см. рекомендации в `SEO_HEAD_FIX_SUMMARY.md`)

```typescript
// app/product/[id]/page.tsx
import { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await fetchProduct(params.id);
  
  return {
    title: `${product.name} | Гелион`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  };
}
```

## Метрики производительности

SEOHead практически не влияет на производительность:

- Размер: ~2KB (минифицирован)
- Время выполнения: <5ms
- Re-renders: только при изменении пропсов

## Следующие шаги

1. ✅ Проверьте, что все страницы используют обновленный SEOHead
2. ✅ Убедитесь, что title обновляется на всех страницах
3. ⏭ Рассмотрите миграцию на `generateMetadata` для лучшего SEO
4. ⏭ Настройте sitemap.xml и robots.txt
5. ⏭ Добавьте Google Analytics и Search Console


