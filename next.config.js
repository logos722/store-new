import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // SCSS конфигурация
  sassOptions: {
    includePaths: [path.join(__dirname, 'src')],
  },

  // Оптимизация изображений для SEO и производительности
  images: {
    //    domains: ['localhost', 'backend'],
    // Новая конфигурация remotePatterns вместо устаревшей domains
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'backend',
        pathname: '/images/**',
      },
    ],
    formats: ['image/webp', 'image/avif'], // Современные форматы для лучшей производительности
    minimumCacheTTL: 60 * 60 * 24 * 365, // Кэширование на год
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Адаптивные размеры
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Размеры для иконок
  },

  // Переменные окружения
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },

  // Оптимизация производительности
  experimental: {
    optimizeCss: true, // Отключено временно - требует пакет critters
    scrollRestoration: true, // Восстановление позиции прокрутки
  },

  // Сжатие
  compress: true,

  // PWA и производительность
  poweredByHeader: false, // Убираем X-Powered-By заголовок для безопасности

  // Оптимизация сборки
  swcMinify: true, // Используем SWC для минификации

  // Настройки заголовков для SEO и безопасности
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      // Кэширование статических ресурсов
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Кэширование изображений
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=31536000',
          },
        ],
      },
    ];
  },

  // Перенаправления изображений и специальные маршруты
  async rewrites() {
    const host = process.env.NEXT_PUBLIC_IMAGE_HOST ?? 'http://localhost:5000';
    return [
      {
        source: '/images/:path*',
        destination: `${host}/images/:path*`,
      },
    ];
  },

  // Редиректы для SEO и блокировка нежелательных запросов
  async redirects() {
    return [
      // Редирект с www на без www (или наоборот, в зависимости от предпочтений)
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.store-new.com',
          },
        ],
        destination: 'https://store-new.com/:path*',
        permanent: true,
      },
      // Блокируем Chrome DevTools запросы (возвращает 404)
      {
        source: '/.well-known/appspecific/:path*',
        destination: '/404',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
