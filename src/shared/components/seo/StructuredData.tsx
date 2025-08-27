'use client';

import { Product } from '@/types/product';

/**
 * Типы структурированных данных для Schema.org
 */
export interface OrganizationSchema {
  '@context': string;
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  sameAs?: string[];
  contactPoint?: {
    '@type': 'ContactPoint';
    telephone: string;
    contactType: string;
    availableLanguage: string;
  };
}

export interface WebsiteSchema {
  '@context': string;
  '@type': 'WebSite';
  name: string;
  url: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
}

export interface ProductSchema {
  '@context': string;
  '@type': 'Product';
  name: string;
  description: string;
  image: string[];
  brand?: {
    '@type': 'Brand';
    name: string;
  };
  offers: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
    availability: string;
    seller: {
      '@type': 'Organization';
      name: string;
    };
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: string;
    reviewCount: string;
  };
}

export interface BreadcrumbSchema {
  '@context': string;
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

/**
 * Утилиты для создания структурированных данных Schema.org
 */
export class StructuredDataGenerator {
  private static baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://store-new.com';

  /**
   * Генерирует схему организации
   */
  static generateOrganizationSchema(): OrganizationSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Гелион',
      url: this.baseUrl,
      logo: `${this.baseUrl}/logo.png`,
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
  static generateWebsiteSchema(): WebsiteSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Гелион - Интернет-магазин сантехники',
      url: this.baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${this.baseUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    };
  }

  /**
   * Генерирует схему товара
   */
  static generateProductSchema(
    product: Product & { rating?: number; ratingCount?: number },
  ): ProductSchema {
    const availability =
      product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock';

    const schema: ProductSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: [
        typeof product.image === 'string'
          ? product.image.startsWith('http')
            ? product.image
            : `${this.baseUrl}${product.image}`
          : `${this.baseUrl}/default-product.jpg`,
      ],
      brand: {
        '@type': 'Brand',
        name: 'Гелион',
      },
      offers: {
        '@type': 'Offer',
        price: product.price.toString(),
        priceCurrency: 'RUB',
        availability,
        seller: {
          '@type': 'Organization',
          name: 'Гелион',
        },
      },
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
  static generateBreadcrumbSchema(
    items: Array<{
      name: string;
      url: string;
    }>,
  ): BreadcrumbSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url.startsWith('http')
          ? item.url
          : `${this.baseUrl}${item.url}`,
      })),
    };
  }

  /**
   * Генерирует схему для страницы каталога
   */
  static generateCatalogPageSchema(
    categoryName: string,
    products: Product[],
    categoryUrl: string,
  ) {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${categoryName} - Гелион`,
      description: `Каталог товаров категории ${categoryName}`,
      url: `${this.baseUrl}${categoryUrl}`,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: products.length,
        itemListElement: products.slice(0, 10).map((product, index) => ({
          '@type': 'Product',
          position: index + 1,
          name: product.name,
          url: `${this.baseUrl}/product/${product.id}`,
          image:
            typeof product.image === 'string'
              ? product.image.startsWith('http')
                ? product.image
                : `${this.baseUrl}${product.image}`
              : `${this.baseUrl}/default-product.jpg`,
          offers: {
            '@type': 'Offer',
            price: product.price.toString(),
            priceCurrency: 'RUB',
          },
        })),
      },
    };
  }

  /**
   * Генерирует схему для страницы избранного
   */
  static generateFavoritesPageSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Избранные товары - Гелион',
      description: 'Список избранных товаров пользователя',
      url: `${this.baseUrl}/favorites`,
      isPartOf: {
        '@type': 'WebSite',
        name: 'Гелион',
        url: this.baseUrl,
      },
    };
  }
}

/**
 * Компонент для вставки структурированных данных в HEAD
 * Используется в клиентских компонентах
 */
interface StructuredDataProps {
  data: object | object[];
}

const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  const jsonLd = Array.isArray(data) ? data : [data];

  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item),
          }}
        />
      ))}
    </>
  );
};

export default StructuredData;
