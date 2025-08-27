import { Metadata } from 'next';
import { Product } from '@/types/product';

/**
 * Утилиты для генерации SEO метаданных с использованием нового Metadata API Next.js 13+
 */

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://store-new.com';
const siteName = 'Гелион - Интернет-магазин сантехники';
const defaultDescription =
  'Гелион - ведущий интернет-магазин сантехники и строительных материалов. Широкий ассортимент, низкие цены, быстрая доставка по всей России.';

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
    image = '/images/default-og-image.jpg',
    noIndex = false,
    canonicalUrl,
  } = config;

  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const imageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;
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
    ],
    image: '/images/home-og-image.jpg',
  });
}

/**
 * Генерирует метаданные для страницы товара
 */
export function generateProductMetadata(
  product: Product & { rating?: number; ratingCount?: number },
): Metadata {
  const imageUrl =
    typeof product.image === 'string'
      ? product.image.startsWith('http')
        ? product.image
        : `${baseUrl}${product.image}`
      : `${baseUrl}/images/default-product.jpg`;

  const keywords = [
    product.name,
    product.category,
    'купить',
    'цена',
    'доставка',
    'Гелион',
  ];

  const description = `${product.name} - ${product.description}. Цена: ${product.price} ₽. ${product.stock > 0 ? 'В наличии' : 'Под заказ'}. Быстрая доставка по России.`;

  return {
    title: product.name,
    description,
    keywords: keywords.join(', '),
    openGraph: {
      title: product.name,
      description,
      url: `${baseUrl}/product/${product.id}`,
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
    image: `/images/categories/${categoryId}-og.jpg`,
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
