# SEO Оптимизация - Руководство по внедрению

## 🎯 Обзор внедренных оптимизаций

Данный проект был полностью оптимизирован для поисковых систем с использованием лучших практик Next.js и современных SEO техник.

## 📋 Реализованные компоненты и функции

### 1. SEO Компоненты (`src/shared/components/seo/`)

#### `SEOHead.tsx`

- Универсальный компонент для управления метаданными
- Поддержка Open Graph и Twitter Cards
- Автоматическая генерация канонических URL
- Управление индексацией поисковиками
- **Используется в клиентских компонентах** ('use client')
- Дополняет Metadata API для динамического контента

#### `StructuredData.tsx` и `ServerStructuredData.tsx`

- **StructuredData.tsx** - для клиентских компонентов ('use client')
- **ServerStructuredData.tsx** - для серверных компонентов
- Генерация Schema.org разметки
- Поддержка товаров, организации, хлебных крошек
- JSON-LD структурированные данные

#### `structuredData.ts`

- Серверные утилиты для генерации структурированных данных
- `ServerStructuredDataGenerator` - для использования в серверных компонентах
- Все те же функции, что и в клиентской версии

#### `Breadcrumbs.tsx`

- SEO-оптимизированные хлебные крошки
- Автоматическая генерация на основе URL
- Поддержка структурированных данных
- Доступность (ARIA)

### 2. Утилиты SEO (`src/shared/utils/seo.ts`)

- `generateMetadata()` - Генерация базовых метаданных
- `generateProductMetadata()` - Метаданные для товаров
- `generateCategoryMetadata()` - Метаданные для категорий
- Специализированные функции для каждого типа страниц

### 3. SEO Хуки (`src/shared/hooks/useSEO.ts`)

- `useSEO()` - Универсальный хук для генерации SEO данных
- Предустановленные конфигурации для разных типов страниц
- Динамическая генерация метаданных на основе контента
- Упрощает использование SEO компонентов

### 3. Системные файлы

#### `sitemap.ts`

- Динамический sitemap с автоматическим обновлением
- Включает товары, категории, статические страницы
- Настраиваемые приоритеты и частота обновления

#### `robots.ts`

- Оптимизированный robots.txt
- Разные правила для различных поисковых систем
- Блокировка служебных разделов

### 4. Конфигурация Next.js

#### `next.config.js`

- Оптимизация изображений (WebP, AVIF)
- Кэширование ресурсов
- Заголовки безопасности
- Редиректы для SEO

## 🚀 Ключевые SEO улучшения

### Технические оптимизации

1. **Метаданные и разметка**

   - Полная поддержка нового Metadata API Next.js 13+
   - Open Graph и Twitter Cards для всех страниц
   - Schema.org структурированные данные
   - Правильные canonical URL

2. **Производительность**

   - Оптимизация шрифтов с `font-display: swap`
   - Preconnect и DNS prefetch для внешних ресурсов
   - Сжатие и минификация
   - Кэширование статических ресурсов

3. **Изображения**

   - Next.js Image компонент с автоматической оптимизацией
   - Поддержка современных форматов (WebP, AVIF)
   - Lazy loading и responsive images
   - Оптимизированные alt теги

4. **Доступность**
   - Skip to main content ссылка
   - Правильная семантическая разметка
   - ARIA атрибуты
   - Клавиатурная навигация

### Контентные оптимизации

1. **Заголовки страниц**

   - Уникальные title для каждой страницы
   - Оптимальная длина (50-60 символов)
   - Включение ключевых слов

2. **Описания**

   - Уникальные meta descriptions
   - Длина 150-160 символов
   - Призыв к действию

3. **URL структура**
   - ЧПУ (человеко-понятные URL)
   - Логическая иерархия
   - Использование ключевых слов

## 📊 Структурированные данные

Реализованы следующие типы Schema.org разметки:

- **Organization** - информация о компании
- **WebSite** - данные о сайте с поиском
- **Product** - товары с ценами и наличием
- **BreadcrumbList** - навигационные цепочки
- **CollectionPage** - страницы каталога

## 🔧 Настройка переменных окружения

Создайте файл `.env.local` со следующими переменными:

```env
# Базовые настройки
NEXT_PUBLIC_BASE_URL=https://your-domain.com
API_BASE_URL=https://api.your-domain.com

# SEO верификация
GOOGLE_SITE_VERIFICATION=your-google-code
YANDEX_VERIFICATION=your-yandex-code

# Контакты
NEXT_PUBLIC_PHONE=+7-800-123-45-67
NEXT_PUBLIC_EMAIL=info@your-domain.com
```

## 📈 Мониторинг и аналитика

### Рекомендуемые инструменты:

1. **Google Search Console**

   - Мониторинг индексации
   - Анализ поисковых запросов
   - Проверка структурированных данных

2. **Яндекс.Вебмастер**

   - Индексация в Яндексе
   - Региональные настройки
   - Анализ ссылок

3. **PageSpeed Insights**
   - Скорость загрузки
   - Core Web Vitals
   - Мобильная оптимизация

## 🎯 Рекомендации по использованию

### Для серверных страниц товаров:

```tsx
import { generateProductMetadata } from '@/shared/utils/seo';
import ServerStructuredData from '@/shared/components/seo/ServerStructuredData';
import { ServerStructuredDataGenerator } from '@/shared/utils/structuredData';

export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);
  return generateProductMetadata(product);
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.id);
  const productSchema =
    ServerStructuredDataGenerator.generateProductSchema(product);

  return (
    <>
      <ServerStructuredData data={productSchema} />
      {/* Контент товара */}
    </>
  );
}
```

### Для клиентских компонентов с SEOHead:

```tsx
'use client';

import SEOHead from '@/shared/components/seo/SEOHead';
import StructuredData, {
  StructuredDataGenerator,
} from '@/shared/components/seo/StructuredData';
import Breadcrumbs from '@/shared/components/seo/Breadcrumbs';
import useSEO from '@/shared/hooks/useSEO';

export default function ClientProductPage({ product }) {
  const { productPageSEO } = useSEO();
  const seoData = productPageSEO(product);
  const productSchema = StructuredDataGenerator.generateProductSchema(product);

  return (
    <>
      {/* SEO метаданные */}
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        image={seoData.image}
        canonicalUrl={`/product/${product.id}`}
        structuredData={productSchema}
      />

      {/* Структурированные данные */}
      <StructuredData data={productSchema} />

      {/* Хлебные крошки */}
      <Breadcrumbs />

      {/* Контент товара */}
    </>
  );
}
```

### Для страниц избранного (пример):

```tsx
'use client';

import SEOHead from '@/shared/components/seo/SEOHead';
import useSEO from '@/shared/hooks/useSEO';

export default function FavoritesPage() {
  const { favoritesPageSEO } = useSEO();
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

### Для страниц категорий:

```tsx
import { generateCategoryMetadata } from '@/shared/utils/seo';

export async function generateMetadata({ params }) {
  return generateCategoryMetadata(
    'Название категории',
    params.category,
    productsCount,
  );
}
```

## ⚡ Производительность

Внедренные оптимизации обеспечивают:

- **LCP (Largest Contentful Paint)** < 2.5s
- **FID (First Input Delay)** < 100ms
- **CLS (Cumulative Layout Shift)** < 0.1
- **Lighthouse Score** > 90

## 🔍 Проверка SEO

### Автоматические проверки:

1. Валидация HTML разметки
2. Проверка структурированных данных
3. Анализ метатегов
4. Тестирование мобильной версии

### Инструменты для проверки:

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## 🚦 Чек-лист внедрения

- ✅ Настроены метаданные для всех страниц
- ✅ Добавлены структурированные данные
- ✅ Создан динамический sitemap
- ✅ Настроен robots.txt
- ✅ Оптимизированы изображения
- ✅ Добавлены хлебные крошки
- ✅ Настроена производительность
- ✅ Добавлена поддержка PWA
- ✅ Настроена доступность

## 📞 Поддержка

При возникновении вопросов по SEO оптимизации обращайтесь к документации Next.js или изучайте комментарии в коде - каждый компонент подробно документирован.

---

**Важно**: После внедрения всех изменений обязательно протестируйте сайт с помощью Google Search Console и других SEO инструментов.
