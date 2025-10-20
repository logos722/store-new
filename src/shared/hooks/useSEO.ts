import { useMemo, useCallback } from 'react';
import { Product } from '@/types/product';

/**
 * Хук для генерации SEO данных для различных типов страниц
 */

interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export const useSEO = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gelionaqua.ru';
  const siteName = 'Гелион - Интернет-магазин сантехники';

  /**
   * SEO данные для главной страницы
   */
  const homePageSEO = useMemo(
    (): SEOData => ({
      title: 'Гелион - Интернет-магазин сантехники',
      description:
        'Гелион - ведущий интернет-магазин сантехники и строительных материалов. Трубы ПВХ, фитинги, сантехника, инструменты. Низкие цены, быстрая доставка.',
      keywords:
        'сантехника, трубы ПВХ, фитинги, строительные материалы, интернет-магазин, доставка, низкие цены',
      image: '/images/home-og-image.jpg',
    }),
    [],
  );

  /**
   * SEO данные для страницы каталога
   */
  const catalogPageSEO = useMemo(
    (): SEOData => ({
      title: 'Каталог товаров',
      description:
        'Полный каталог товаров Гелион. Сантехника, трубы ПВХ, фитинги, строительные материалы и инструменты по выгодным ценам.',
      keywords:
        'каталог, товары, сантехника, строительные материалы, интернет-магазин',
      image: '/images/catalog-og-image.jpg',
    }),
    [],
  );

  /**
   * SEO данные для страницы избранного
   */
  const favoritesPageSEO = useCallback(
    (count?: number): SEOData => ({
      title: 'Избранные товары',
      description: count
        ? `У вас ${count} ${count === 1 ? 'избранный товар' : 'избранных товаров'} в интернет-магазине Гелион.`
        : 'Ваши избранные товары в интернет-магазине Гелион. Сохраняйте понравившиеся товары и покупайте в удобное время.',
      keywords: 'избранное, список желаний, сохраненные товары',
      noindex: true,
      nofollow: true,
    }),
    [],
  );

  /**
   * SEO данные для страницы корзины
   */
  const cartPageSEO = useMemo(
    (): SEOData => ({
      title: 'Корзина',
      description:
        'Корзина покупок в интернет-магазине Гелион. Оформите заказ быстро и удобно.',
      keywords: 'корзина, покупки, заказ, оформление',
      noindex: true,
      nofollow: true,
    }),
    [],
  );

  /**
   * SEO данные для страницы товара
   */
  const productPageSEO = useCallback(
    (product: Product & { rating?: number; ratingCount?: number }): SEOData => {
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
      ].join(', ');

      const description = `${product.name} - ${product.description}. Цена: ${product.price} ₽. ${product.stock > 0 ? 'В наличии' : 'Под заказ'}. Быстрая доставка по России.`;

      return {
        title: product.name,
        description,
        keywords,
        image: imageUrl,
      };
    },
    [baseUrl],
  );

  /**
   * SEO данные для страницы категории
   */
  const categoryPageSEO = useCallback(
    (categoryName: string, productsCount?: number): SEOData => {
      const description = `${categoryName} в интернет-магазине Гелион. ${productsCount ? `${productsCount} товаров` : 'Широкий выбор товаров'} по выгодным ценам. Быстрая доставка по России.`;

      const keywords = [
        categoryName,
        'купить',
        'цена',
        'каталог',
        'интернет-магазин',
        'Гелион',
      ].join(', ');

      return {
        title: categoryName,
        description,
        keywords,
        image: `/images/categories/${categoryName.toLowerCase()}-og.jpg`,
      };
    },
    [],
  );

  /**
   * SEO данные для страницы статей
   */
  const articlesPageSEO = useMemo(
    (): SEOData => ({
      title: 'Полезные статьи',
      description:
        'Полезные статьи и советы по выбору сантехники, монтажу труб ПВХ, строительству и ремонту от экспертов Гелион.',
      keywords: 'статьи, советы, монтаж, ремонт, строительство, сантехника',
      image: '/images/articles-og-image.jpg',
    }),
    [],
  );

  return {
    homePageSEO,
    catalogPageSEO,
    favoritesPageSEO,
    cartPageSEO,
    productPageSEO,
    categoryPageSEO,
    articlesPageSEO,
    siteName,
    baseUrl,
  };
};

export default useSEO;
