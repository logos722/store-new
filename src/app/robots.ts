import { MetadataRoute } from 'next';

/**
 * Генерирует robots.txt для управления индексацией поисковиками
 * 
 * Особенности:
 * - Разрешает индексацию всех важных страниц
 * - Блокирует административные и служебные разделы
 * - Указывает путь к sitemap
 * - Оптимизирован для поисковых систем
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://store-new.com';
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/catalog',
          '/catalog/*',
          '/product/*',
          '/articles',
          '/articles/*',
          '/help',
          '/favorites',
        ],
        disallow: [
          '/api/*',
          '/admin/*',
          '/_next/*',
          '/cart', // Корзина не должна индексироваться
          '/checkout', // Оформление заказа не должно индексироваться
          '/profile', // Личный кабинет не должен индексироваться
          '/search?*', // Страницы поиска с параметрами
          '/*?*sort=*', // Страницы с сортировкой
          '/*?*filter=*', // Страницы с фильтрами
          '/tmp/*',
          '/*.json$',
          '/*.xml$',
        ],
        crawlDelay: 1, // Задержка между запросами в секундах
      },
      // Специальные правила для основных поисковых систем
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/catalog',
          '/catalog/*',
          '/product/*',
          '/articles',
          '/articles/*',
          '/help',
        ],
        disallow: [
          '/api/*',
          '/admin/*',
          '/_next/*',
          '/cart',
          '/checkout',
          '/profile',
          '/favorites', // Google может не индексировать персональные страницы
        ],
      },
      {
        userAgent: 'Yandex',
        allow: [
          '/',
          '/catalog',
          '/catalog/*',
          '/product/*',
          '/articles',
          '/articles/*',
          '/help',
          '/favorites', // Яндекс может индексировать избранное
        ],
        disallow: [
          '/api/*',
          '/admin/*',
          '/_next/*',
          '/cart',
          '/checkout',
          '/profile',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
