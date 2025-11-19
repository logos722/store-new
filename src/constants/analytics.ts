/**
 * Константы для системы аналитики
 *
 * ⚠️ ВАЖНО: Создайте файл .env.local и добавьте настоящие ID:
 * NEXT_PUBLIC_YANDEX_METRIKA_ID=ваш_id
 * NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
 */

import { AnalyticsConfig } from '@/types/analytics';

/**
 * Конфигурация аналитики для production
 *
 * В development режиме аналитика будет работать с debug флагом,
 * но не будет отправлять данные на реальные счетчики (если ID не указаны)
 */
export const ANALYTICS_CONFIG: AnalyticsConfig = {
  // Яндекс.Метрика (критически важна для СНГ рынка)
  yandexMetrika: process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID
    ? {
        id: process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID,
        clickmap: true, // Карта кликов
        trackLinks: true, // Отслеживание внешних ссылок
        accurateTrackBounce: true, // Точный показатель отказов
        webvisor: false, // Вебвизор (отключен для производительности, включите при необходимости)
        ecommerce: true, // E-commerce данные
        triggerEvent: true, // Триггерные события
      }
    : undefined,

  // Google Analytics 4 (для международной аудитории)
  googleAnalytics: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    ? {
        measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
      }
    : undefined,

  // Debug режим в development
  debug: process.env.NODE_ENV === 'development',
};

/**
 * Названия целей для Яндекс.Метрики
 *
 * После настройки целей в интерфейсе Яндекс.Метрики,
 * используйте эти константы для отслеживания
 */
export const YANDEX_GOALS = {
  // E-commerce цели
  VIEW_PRODUCT: 'view_product',
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  BEGIN_CHECKOUT: 'begin_checkout',
  PURCHASE: 'purchase',

  // Пользовательские цели
  ADD_TO_FAVORITES: 'add_to_favorites',
  SEARCH: 'search',
  CONTACT_FORM_SUBMIT: 'contact_form_submit',
  PHONE_CLICK: 'phone_click',
  EMAIL_CLICK: 'email_click',

  // Социальные сети
  SOCIAL_CLICK: 'social_click',
} as const;

/**
 * Категории событий для аналитики
 */
export const EVENT_CATEGORIES = {
  PRODUCT: 'Product',
  CART: 'Cart',
  CHECKOUT: 'Checkout',
  FAVORITES: 'Favorites',
  SEARCH: 'Search',
  CATALOG: 'Catalog',
  UI: 'UI',
  CONTACT: 'Contact',
  SOCIAL: 'Social',
} as const;

/**
 * Проверка доступности аналитики
 */
export const isAnalyticsAvailable = (): boolean => {
  return !!(ANALYTICS_CONFIG.yandexMetrika || ANALYTICS_CONFIG.googleAnalytics);
};

/**
 * Получение информации о настроенных провайдерах
 */
export const getAnalyticsProviders = (): string[] => {
  const providers: string[] = [];

  if (ANALYTICS_CONFIG.yandexMetrika) {
    providers.push('Яндекс.Метрика');
  }

  if (ANALYTICS_CONFIG.googleAnalytics) {
    providers.push('Google Analytics 4');
  }

  return providers;
};
