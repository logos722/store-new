'use client';

import Head from 'next/head';

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
 * SEO компонент для управления метаданными страницы
 *
 * Особенности:
 * - Поддерживает Open Graph и Twitter Cards
 * - Автоматически генерирует канонические URL
 * - Поддерживает структурированные данные
 * - Управляет индексацией поисковиками
 * - Поддерживает мультиязычность
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
  // Генерируем полный URL для текущей страницы
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gelionaqua.ru';

  // Используем переданный URL или создаем базовый URL
  const fullUrl = url || baseUrl;
  const canonical = canonicalUrl || fullUrl;
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

  // Формируем robots директиву
  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
  ].join(', ');

  // Генерируем полный заголовок с названием сайта
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  return (
    <Head>
      {/* Основные метатеги */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Robots и канонический URL */}
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={canonical} />

      {/* Viewport для мобильной адаптивности */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Open Graph метатеги */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />

      {/* Альтернативные локали */}
      {alternateLocales.map(altLocale => (
        <meta
          key={altLocale}
          property="og:locale:alternate"
          content={altLocale}
        />
      ))}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* Дополнительные метатеги для лучшей индексации */}
      <meta name="author" content={siteName} />
      <meta name="theme-color" content="#1976d2" />

      {/* Favicon и иконки */}
      <link rel="icon" href="/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Структурированные данные JSON-LD */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}

      {/* Preconnect к внешним ресурсам для ускорения загрузки */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />

      {/* DNS prefetch для улучшения производительности */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
    </Head>
  );
};

export default SEOHead;
