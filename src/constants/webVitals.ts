/**
 * Конфигурация Web Vitals мониторинга
 *
 * Настройки для сбора и анализа производительности приложения
 */

import type { WebVitalsConfig } from '@/types/webVitals';

/**
 * Конфигурация Web Vitals для разных окружений
 */
export const WEB_VITALS_CONFIG: WebVitalsConfig = {
  // Включить сбор метрик (отключите для development если не нужно)
  enabled:
    process.env.NODE_ENV === 'production' ||
    process.env.NEXT_PUBLIC_WEB_VITALS_ENABLED === 'true',

  // API endpoint для отправки метрик
  endpoint: '/api/web-vitals',

  // Версия приложения (из package.json или переменной окружения)
  version: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',

  // Окружение
  environment:
    (process.env.NODE_ENV as 'production' | 'development') || 'production',

  // Отправлять только Core Web Vitals (LCP, FID/INP, CLS)
  // true - только важные метрики (экономит трафик)
  // false - все метрики включая FCP, TTFB
  coreOnly: process.env.NEXT_PUBLIC_WEB_VITALS_CORE_ONLY === 'true',

  // Debug режим (логирование в консоль)
  debug: process.env.NODE_ENV === 'development',

  // Sampling rate (процент пользователей)
  // 1.0 = 100% пользователей
  // 0.1 = 10% пользователей (рекомендуется для высоконагруженных проектов)
  samplingRate: process.env.NODE_ENV === 'production' ? 1.0 : 1.0,
};

/**
 * Пороговые значения для Core Web Vitals (согласно Google)
 *
 * @see https://web.dev/vitals/#core-web-vitals
 */
export const WEB_VITALS_THRESHOLDS = {
  // Largest Contentful Paint (LCP)
  // Измеряет скорость загрузки основного контента
  LCP: {
    good: 2500, // <= 2.5s - хорошо
    poor: 4000, // > 4s - плохо
  },

  // First Input Delay (FID) - старая метрика
  // Измеряет время до первого взаимодействия
  FID: {
    good: 100, // <= 100ms - хорошо
    poor: 300, // > 300ms - плохо
  },

  // Interaction to Next Paint (INP) - новая метрика, заменяет FID
  // Измеряет отзывчивость на взаимодействия
  INP: {
    good: 200, // <= 200ms - хорошо
    poor: 500, // > 500ms - плохо
  },

  // Cumulative Layout Shift (CLS)
  // Измеряет визуальную стабильность (без единиц измерения)
  CLS: {
    good: 0.1, // <= 0.1 - хорошо
    poor: 0.25, // > 0.25 - плохо
  },

  // First Contentful Paint (FCP)
  // Измеряет время до первой отрисовки контента
  FCP: {
    good: 1800, // <= 1.8s - хорошо
    poor: 3000, // > 3s - плохо
  },

  // Time to First Byte (TTFB)
  // Измеряет скорость ответа сервера
  TTFB: {
    good: 800, // <= 800ms - хорошо
    poor: 1800, // > 1.8s - плохо
  },
} as const;

/**
 * Рекомендации по оптимизации для каждой метрики
 */
export const WEB_VITALS_RECOMMENDATIONS = {
  LCP: [
    'Оптимизируйте изображения (WebP, lazy loading)',
    'Используйте CDN для статических ресурсов',
    'Минимизируйте время ответа сервера',
    'Удалите render-blocking ресурсы',
    'Используйте preload для критических ресурсов',
  ],

  FID: [
    'Разбейте длинные задачи на более мелкие',
    'Оптимизируйте JavaScript (code splitting)',
    'Используйте web workers для тяжелых вычислений',
    'Минимизируйте JavaScript на странице',
    'Используйте lazy loading для некритичного JS',
  ],

  INP: [
    'Оптимизируйте обработчики событий',
    'Избегайте длительных синхронных операций',
    'Используйте debounce/throttle для частых событий',
    'Оптимизируйте ререндеры React компонентов',
    'Используйте React.memo и useMemo',
  ],

  CLS: [
    'Всегда указывайте размеры изображений и видео',
    'Резервируйте место для динамического контента',
    'Избегайте вставки контента над существующим',
    'Используйте CSS aspect-ratio',
    'Предзагружайте шрифты с font-display: swap',
  ],

  FCP: [
    'Оптимизируйте критический путь рендеринга',
    'Встраивайте критический CSS',
    'Минимизируйте blocking ресурсы',
    'Используйте Server-Side Rendering',
    'Оптимизируйте шрифты (preload, font-display)',
  ],

  TTFB: [
    'Используйте CDN для контента',
    'Оптимизируйте работу с базой данных',
    'Включите кэширование на сервере',
    'Используйте HTTP/2 или HTTP/3',
    'Оптимизируйте cold start для serverless',
  ],
} as const;
