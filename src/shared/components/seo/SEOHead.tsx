'use client';

import { useEffect } from 'react';

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  siteName?: string;
  locale?: string;
  alternateLocales?: string[];
  noindex?: boolean;
  nofollow?: boolean;
  canonicalUrl?: string;
  structuredData?: object;
}

/**
 * SEO компонент для управления метаданными страницы в Next.js App Router
 *
 * Особенности:
 * - Использует прямые манипуляции DOM для обновления метатегов
 * - Работает в клиентских компонентах Next.js 13+ App Router
 * - Поддерживает Open Graph и Twitter Cards
 * - Автоматически генерирует канонические URL
 * - Поддерживает структурированные данные
 * - Управляет индексацией поисковиками
 * - Поддерживает мультиязычность
 *
 * ВАЖНО: Этот компонент работает только на клиенте!
 * Для SSR/SSG используйте generateMetadata в серверных компонентах.
 */
const SEOHead: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image = '/images/default-og-image.jpg',
  url,
  type = 'website',
  siteName = 'Гелион - Интернет-магазин сантехники',
  locale = 'ru_RU',
  alternateLocales = [],
  noindex = false,
  nofollow = false,
  canonicalUrl,
  structuredData,
}) => {
  useEffect(() => {
    // Генерируем полный URL для текущей страницы
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gelionaqua.ru';

    // Используем переданный URL или создаем базовый URL
    const fullUrl = url || baseUrl;
    const canonical = canonicalUrl || fullUrl;
    const fullImageUrl = image.startsWith('http')
      ? image
      : `${baseUrl}${image}`;

    // Формируем robots директиву
    const robotsContent = [
      noindex ? 'noindex' : 'index',
      nofollow ? 'nofollow' : 'follow',
    ].join(', ');

    // Генерируем полный заголовок с названием сайта
    const fullTitle = title.includes(siteName)
      ? title
      : `${title} | ${siteName}`;

    // Утилита для обновления/создания мета-тега
    const updateMetaTag = (
      selector: string,
      attribute: string,
      value: string,
    ) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        const [attrName, attrValue] =
          selector.match(/\[(.*?)="(.*?)"\]/)?.slice(1) || [];
        if (attrName && attrValue) {
          element.setAttribute(attrName, attrValue);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    // Утилита для обновления/создания link тега
    const updateLinkTag = (
      rel: string,
      href: string,
      attributes?: Record<string, string>,
    ) => {
      let element = document.querySelector(
        `link[rel="${rel}"]`,
      ) as HTMLLinkElement;
      if (!element) {
        element = document.createElement('link');
        element.rel = rel;
        document.head.appendChild(element);
      }
      element.href = href;
      if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
          element.setAttribute(key, value);
        });
      }
    };

    // Обновляем title
    document.title = fullTitle;

    // Основные метатеги
    updateMetaTag('meta[name="description"]', 'content', description);
    if (keywords) {
      updateMetaTag('meta[name="keywords"]', 'content', keywords);
    }

    // Robots
    updateMetaTag('meta[name="robots"]', 'content', robotsContent);

    // Канонический URL
    updateLinkTag('canonical', canonical);

    // Open Graph метатеги
    updateMetaTag('meta[property="og:type"]', 'content', type);
    updateMetaTag('meta[property="og:title"]', 'content', title);
    updateMetaTag('meta[property="og:description"]', 'content', description);
    updateMetaTag('meta[property="og:image"]', 'content', fullImageUrl);
    updateMetaTag('meta[property="og:url"]', 'content', fullUrl);
    updateMetaTag('meta[property="og:site_name"]', 'content', siteName);
    updateMetaTag('meta[property="og:locale"]', 'content', locale);

    // Twitter Cards
    updateMetaTag(
      'meta[name="twitter:card"]',
      'content',
      'summary_large_image',
    );
    updateMetaTag('meta[name="twitter:title"]', 'content', title);
    updateMetaTag('meta[name="twitter:description"]', 'content', description);
    updateMetaTag('meta[name="twitter:image"]', 'content', fullImageUrl);

    // Дополнительные метатеги
    updateMetaTag('meta[name="author"]', 'content', siteName);
    updateMetaTag('meta[name="theme-color"]', 'content', '#1976d2');

    // Удаляем старые альтернативные локали
    document
      .querySelectorAll('meta[property="og:locale:alternate"]')
      .forEach(el => el.remove());

    // Добавляем новые альтернативные локали
    alternateLocales.forEach(altLocale => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:locale:alternate');
      meta.setAttribute('content', altLocale);
      document.head.appendChild(meta);
    });

    // Структурированные данные JSON-LD
    const existingScript = document.querySelector(
      'script[type="application/ld+json"][data-seo-head]',
    );
    if (existingScript) {
      existingScript.remove();
    }

    if (structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo-head', 'true');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // Cleanup function для удаления добавленных тегов при размонтировании
    return () => {
      // Опционально: можно удалить добавленные теги
      // Но обычно это не нужно, так как они будут перезаписаны следующей страницей
    };
  }, [
    title,
    description,
    keywords,
    image,
    url,
    type,
    siteName,
    locale,
    alternateLocales,
    noindex,
    nofollow,
    canonicalUrl,
    structuredData,
  ]);

  // Компонент не рендерит ничего визуального
  return null;
};

export default SEOHead;
