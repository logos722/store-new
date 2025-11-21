import { Product } from '@/types/product';
import { normalizeImageUrl } from './seo';
/**
 * Серверные утилиты для генерации структурированных данных Schema.org
 * Не содержит 'use client' и может использоваться в серверных компонентах
 */

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gelionaqua.ru';

/**
 * Генерирует схему организации
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Гелион',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    sameAs: [
      'https://vk.com/store-new',
      'https://t.me/store-new',
      'https://instagram.com/store-new',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+7-800-123-45-67',
      contactType: 'customer service',
      availableLanguage: 'Russian',
    },
  };
}

/**
 * Генерирует схему веб-сайта с поиском
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Гелион - Интернет-магазин сантехники',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}
/**
 * Генерирует схему товара
 * Соответствует требованиям Schema.org и Яндекс.Товары
 *
 * Обязательные поля для Яндекс.Товары:
 * - name, brand, image, url, sku, price, priceCurrency, availability
 */
export function generateProductSchema(
  product: Product & { rating?: number; ratingCount?: number },
) {
  const availability =
    product.stock > 0
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock';

  // Нормализуем URL изображения для корректного отображения в соцсетях и Яндекс.Товары
  const imageUrl = normalizeImageUrl(product.image as string);

  // Генерируем полный URL товара
  const productUrl = `${baseUrl}/product/${product.slug || product.id}`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: [imageUrl],
    url: productUrl,
    sku: product.id, // Добавлено: Уникальный артикул (требуется для Яндекс.Товары)
    brand: {
      '@type': 'Brand',
      name: 'Гелион',
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      price: product.price.toString(),
      priceCurrency: 'RUB',
      availability,
      seller: {
        '@type': 'Organization',
        name: 'Гелион',
      },
    },
    aggregateRating: undefined as
      | {
          '@type': 'AggregateRating';
          ratingValue: string;
          reviewCount: string;
        }
      | undefined,
  };

  // Добавляем рейтинг, если есть
  if (product.rating && product.ratingCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toString(),
      reviewCount: product.ratingCount.toString(),
    };
  }

  return schema;
}

/**
 * Генерирует хлебные крошки
 */
export function generateBreadcrumbSchema(
  items: Array<{
    name: string;
    url: string;
  }>,
) {
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

/**
 * Генерирует схему для страницы каталога
 * Соответствует требованиям Schema.org CollectionPage
 *
 * ВАЖНО: Для интеграции с Яндекс.Товары все товары в списке должны
 * содержать полную информацию (включая изображения, цены, наличие)
 *
 * @param categoryName - Название категории
 * @param products - Массив товаров (рекомендуется 10-20 товаров)
 * @param categoryUrl - Относительный URL категории (например, /catalog/pvc)
 */
export function generateCatalogPageSchema(
  categoryName: string,
  products: Product[],
  categoryUrl: string,
) {
  // Предупреждение о пустом массиве товаров
  if (products.length === 0) {
    console.warn(
      `[Schema.org] generateCatalogPageSchema called with empty products array for category: ${categoryName}. ` +
        `This will result in empty itemListElement, which is not optimal for SEO.`,
    );
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryName} - Гелион`,
    description: `Каталог товаров категории ${categoryName}. ${products.length > 0 ? `${products.length} товаров в наличии` : 'Широкий выбор качественной продукции'}.`,
    url: `${baseUrl}${categoryUrl}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.slice(0, 20).map((product, index) => ({
        '@type': 'Product',
        position: index + 1,
        name: product.name,
        url: `${baseUrl}/product/${product.slug || product.id}`,
        image: [normalizeImageUrl(product.image as string)],
        offers: {
          '@type': 'Offer',
          price: product.price.toString(),
          priceCurrency: 'RUB', // ISO 4217 (не RUR!)
          availability:
            product.stock > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
        },
      })),
    },
  };
}

/**
 * Генерирует схему для страницы избранного
 */
export function generateFavoritesPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Избранные товары - Гелион',
    description: 'Список избранных товаров пользователя',
    url: `${baseUrl}/favorites`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Гелион',
      url: baseUrl,
    },
  };
}
