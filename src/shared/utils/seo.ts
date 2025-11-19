import { Metadata } from 'next';
import { Product } from '@/types/product';

/**
 * Утилиты для генерации SEO метаданных с использованием нового Metadata API Next.js 13+
 */

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gelionaqua.ru';
const siteName = 'Гелион - Интернет-магазин сантехники';
const defaultDescription =
  'Гелион - ведущий интернет-магазин сантехники и строительных материалов. Широкий ассортимент, низкие цены, быстрая доставка по всей России.';

/**
 * Преобразует URL изображения для использования в метаданных (og:image, twitter:image)
 *
 * Логика преобразования:
 * 1. Заменяет внутренний URL backend:5000 на публичный домен
 * 2. Для относительных путей добавляет baseUrl
 * 3. Для абсолютных URL (http/https) использует как есть
 *
 * @param imageUrl - URL изображения из API или относительный путь
 * @returns Абсолютный URL изображения для использования в meta тегах
 */
function normalizeImageUrl(imageUrl: string | null | undefined): string {
  // Если URL не указан, используем изображение по умолчанию
  if (!imageUrl) {
    // TODO: Создать /public/images/default-og-image.jpg (1200x630px)
    return `${baseUrl}/web-app-manifest-512x512.png`;
  }

  // Заменяем внутренний URL backend на публичный домен
  // Это необходимо, так как backend:5000 недоступен извне
  if (imageUrl.includes('backend:5000')) {
    return imageUrl.replace('http://backend:5000', baseUrl);
  }

  // Если URL уже абсолютный (начинается с http/https), используем как есть
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Для относительных путей добавляем baseUrl
  if (imageUrl.startsWith('/')) {
    return `${baseUrl}${imageUrl}`;
  }

  // Для путей без слэша в начале
  return `${baseUrl}/${imageUrl}`;
}

export interface SEOConfig {
  title: string;
  description?: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
}

/**
 * Генерирует базовые метаданные для страницы
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description = defaultDescription,
    keywords = [],
    // TODO: Создать /public/images/default-og-image.jpg (1200x630px)
    image = '/web-app-manifest-512x512.png',
    noIndex = false,
    canonicalUrl,
  } = config;

  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  // Используем normalizeImageUrl для корректной обработки всех типов URL
  const imageUrl = normalizeImageUrl(image);
  const canonical = canonicalUrl || undefined;

  return {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical || baseUrl,
      siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'ru_RU',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    other: {
      'theme-color': '#1976d2',
    },
  };
}

/**
 * Генерирует метаданные для главной страницы
 */
export function generateHomeMetadata(): Metadata {
  return generateMetadata({
    title: 'Главная',
    description:
      'Гелион - ведущий интернет-магазин сантехники и строительных материалов. Трубы ПВХ, фитинги, сантехника, инструменты. Низкие цены, быстрая доставка.',
    keywords: [
      'сантехника',
      'трубы ПВХ',
      'фитинги',
      'строительные материалы',
      'интернет-магазин',
      'доставка',
      'низкие цены',
      'Гелион',
      'Гелион сантехника',
      'Гелион интернет-магазин',
      'gelionaqua.ru',
      'Гелион - Интернет-магазин сантехники',
      'Гелион - Интернет-магазин сантехники и строительных материалов',
      'Гелион - Интернет-магазин сантехники и строительных материалов. Трубы ПВХ, фитинги, сантехника, инструменты. Низкие цены, быстрая доставка.',
    ],
    // Временное решение: используем изображение из манифеста
    // TODO: Создать специальное OG-изображение 1200x630px в /public/images/og-image.jpg
    image: '/web-app-manifest-512x512.png',
  });
}

/**
 * Генерирует метаданные для страницы товара
 */
export function generateProductMetadata(
  product: Product & { rating?: number; ratingCount?: number },
): Metadata {
  // Используем normalizeImageUrl для корректного преобразования URL изображения
  // Это особенно важно для og:image, так как он должен быть доступен извне
  // и не может содержать внутренние URL типа http://backend:5000
  const imageUrl = normalizeImageUrl(product.image as string);

  const keywords = [
    product.name,
    product.category,
    'купить',
    'цена',
    'доставка',
    'Гелион',
  ];

  const description = `${product.name} - ${product.description}. Цена: ${product.price} ₽. ${product.stock > 0 ? 'В наличии' : 'Под заказ'}. Быстрая доставка по России.`;

  // Используем product.slug для URL вместо product.id
  // Это обеспечивает консистентность с реальными маршрутами
  const productUrl = `${baseUrl}/product/${product.slug || product.id}`;

  return {
    title: product.name,
    description,
    keywords: keywords.join(', '),
    openGraph: {
      title: product.name,
      description,
      url: productUrl,
      siteName,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      type: 'website',
      locale: 'ru_RU', // Добавляем locale для og:locale
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: [imageUrl],
    },
    other: {
      'product:price:amount': product.price.toString(),
      'product:price:currency': 'RUB',
      'product:availability': product.stock > 0 ? 'instock' : 'outofstock',
    },
  };
}

/**
 * Генерирует метаданные для страницы категории
 */
export function generateCategoryMetadata(
  categoryName: string,
  categoryId: string,
  productsCount?: number,
): Metadata {
  const description = `${categoryName} в интернет-магазине Гелион. ${productsCount ? `${productsCount} товаров` : 'Широкий выбор товаров'} по выгодным ценам. Быстрая доставка по России.`;

  const keywords = [
    categoryName,
    'купить',
    'цена',
    'каталог',
    'интернет-магазин',
    'Гелион',
  ];

  return generateMetadata({
    title: categoryName,
    description,
    keywords,
    canonicalUrl: `${baseUrl}/catalog/${categoryId}`,
    // TODO: Создать изображения для категорий /public/images/categories/${categoryId}-og.jpg (1200x630px)
    // Пока используем общее изображение манифеста
    image: `/web-app-manifest-512x512.png`,
  });
}

/**
 * Генерирует метаданные для страницы избранного
 */
export function generateFavoritesMetadata(): Metadata {
  return generateMetadata({
    title: 'Избранные товары',
    description:
      'Ваши избранные товары в интернет-магазине Гелион. Сохраняйте понравившиеся товары и покупайте в удобное время.',
    keywords: ['избранное', 'список желаний', 'сохраненные товары'],
    noIndex: true, // Персональные страницы не должны индексироваться
  });
}

/**
 * Генерирует метаданные для страницы каталога
 */
export function generateCatalogMetadata(): Metadata {
  return generateMetadata({
    title: 'Каталог товаров',
    description:
      'Полный каталог товаров Гелион. Сантехника, трубы ПВХ, фитинги, строительные материалы и инструменты по выгодным ценам.',
    keywords: [
      'каталог',
      'товары',
      'сантехника',
      'строительные материалы',
      'интернет-магазин',
    ],
  });
}

/**
 * Генерирует метаданные для страницы корзины
 */
export function generateCartMetadata(): Metadata {
  return generateMetadata({
    title: 'Корзина',
    description:
      'Корзина покупок в интернет-магазине Гелион. Оформите заказ быстро и удобно.',
    noIndex: true, // Корзина не должна индексироваться
  });
}

/**
 * Генерирует метаданные для страницы статей
 */
export function generateArticlesMetadata(): Metadata {
  return generateMetadata({
    title: 'Полезные статьи',
    description:
      'Полезные статьи и советы по выбору сантехники, монтажу труб ПВХ, строительству и ремонту от экспертов Гелион.',
    keywords: [
      'статьи',
      'советы',
      'монтаж',
      'ремонт',
      'строительство',
      'сантехника',
    ],
  });
}

/**
 * Утилита для генерации JSON-LD структурированных данных
 */
export function generateJSONLD(data: object): string {
  return JSON.stringify(data, null, 0);
}

/**
 * Генерирует хлебные крошки для структурированных данных
 */
export function generateBreadcrumbsJSONLD(
  items: Array<{ name: string; url: string }>,
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  };
}
