import { MetadataRoute } from 'next';

/**
 * Генерирует robots.txt для управления индексацией поисковиками
 *
 * Особенности:
 * - Разрешает индексацию всех важных страниц (каталог, товары, информационные страницы)
 * - Блокирует административные и служебные разделы
 * - Оптимизирован для Googlebot и Яндекса
 * - Указывает путь к sitemap
 * - Предотвращает дублирование контента через блокировку параметров URL
 *
 * @see https://developers.google.com/search/docs/crawling-indexing/robots/intro
 * @see https://yandex.ru/support/webmaster/controlling-robot/robots-txt.html
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gelionaqua.ru';

  return {
    rules: [
      // Основные правила для всех поисковых систем
      {
        userAgent: '*',
        allow: [
          '/',
          // Каталог и товары
          '/catalog',
          '/catalog/*',
          '/product/*',
          // Контент
          '/articles',
          '/articles/*',
          '/help',
          // Информационные страницы компании
          '/about',
          '/team',
          '/careers',
          '/news',
          '/partners',
          // Поддержка и контакты
          '/faq',
          '/support',
          '/contact',
          '/feedback',
          '/location',
          // Условия сервиса
          '/shipping',
          '/returns',
          // Избранное (публичная страница)
          '/favorites',
        ],
        disallow: [
          // API и служебные маршруты
          '/api/*',
          '/admin/*',
          '/_next/*',
          '/static/*',
          // Персональные страницы
          '/cart', // Корзина не должна индексироваться
          '/checkout', // Оформление заказа
          '/profile', // Личный кабинет
          '/account/*',
          // Параметры URL для предотвращения дублирования
          '/*?*sort=*', // Страницы с сортировкой
          '/*?*filter=*', // Страницы с фильтрами
          '/*?*page=*', // Страницы пагинации (используем canonical)
          '/search?*', // Страницы поиска с параметрами
          '/*?*utm_*', // UTM метки
          '/*?*ref=*', // Реферальные параметры
          // Временные и служебные файлы
          '/tmp/*',
          '/*.json$',
          '/*.xml$',
          '/*.txt$',
        ],
        crawlDelay: 1, // Вежливая задержка между запросами
      },
      // Оптимизированные правила для Googlebot
      {
        userAgent: 'Googlebot',
        allow: [
          '/',
          '/catalog',
          '/catalog/*',
          '/product/*',
          '/articles',
          '/articles/*',
          '/about',
          '/team',
          '/careers',
          '/news',
          '/partners',
          '/faq',
          '/support',
          '/contact',
          '/feedback',
          '/location',
          '/shipping',
          '/returns',
          '/help',
        ],
        disallow: [
          '/api/*',
          '/admin/*',
          '/_next/*',
          '/cart',
          '/checkout',
          '/profile',
          '/account/*',
          '/favorites', // Google может не индексировать персональные страницы
          '/*?*sort=*',
          '/*?*filter=*',
          '/*?*page=*',
          '/search?*',
        ],
        crawlDelay: 0, // Google не требует задержки
      },
      // Оптимизированные правила для Яндекса
      {
        userAgent: 'Yandex',
        allow: [
          '/',
          '/catalog',
          '/catalog/*',
          '/product/*',
          '/articles',
          '/articles/*',
          '/about',
          '/team',
          '/careers',
          '/news',
          '/partners',
          '/faq',
          '/support',
          '/contact',
          '/feedback',
          '/location',
          '/shipping',
          '/returns',
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
          '/account/*',
          '/*?*sort=*',
          '/*?*filter=*',
          '/*?*page=*',
          '/search?*',
        ],
        crawlDelay: 1,
      },
      // Правила для других поисковых систем
      {
        userAgent: ['Bingbot', 'DuckDuckBot', 'Baiduspider'],
        allow: [
          '/',
          '/catalog',
          '/catalog/*',
          '/product/*',
          '/articles',
          '/about',
          '/contact',
          '/faq',
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
