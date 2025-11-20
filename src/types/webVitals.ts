/**
 * Типы для системы мониторинга Web Vitals
 *
 * Core Web Vitals - ключевые метрики производительности:
 * - LCP (Largest Contentful Paint) - скорость загрузки основного контента
 * - FID (First Input Delay) - время до первой интерактивности
 * - CLS (Cumulative Layout Shift) - визуальная стабильность
 * - FCP (First Contentful Paint) - первая отрисовка контента
 * - TTFB (Time to First Byte) - время до первого байта
 * - INP (Interaction to Next Paint) - время взаимодействия (замена FID)
 */

/**
 * Типы метрик Web Vitals
 */
export type WebVitalMetricName = 'CLS' | 'FCP' | 'FID' | 'LCP' | 'TTFB' | 'INP';

/**
 * Рейтинг производительности метрики
 */
export type WebVitalRating = 'good' | 'needs-improvement' | 'poor';

/**
 * Интерфейс метрики Web Vitals (совместим с web-vitals библиотекой)
 */
export interface WebVitalMetric {
  /**
   * ID метрики (уникальный для каждого сбора)
   */
  id: string;

  /**
   * Название метрики
   */
  name: WebVitalMetricName;

  /**
   * Значение метрики (в миллисекундах для временных метрик, безразмерное для CLS)
   */
  value: number;

  /**
   * Рейтинг метрики согласно Google Web Vitals thresholds
   */
  rating: WebVitalRating;

  /**
   * Дельта относительно предыдущего значения
   */
  delta: number;

  /**
   * Навигация (тип загрузки страницы)
   */
  navigationType?:
    | 'navigate'
    | 'reload'
    | 'back-forward'
    | 'back-forward-cache'
    | 'prerender'
    | 'restore';

  /**
   * Дополнительная информация об атрибуции (для детального анализа)
   */
  attribution?: Record<string, unknown>;
}

/**
 * Расширенные данные Web Vitals для отправки на сервер
 */
export interface WebVitalReport extends WebVitalMetric {
  /**
   * URL страницы, где была собрана метрика
   */
  url: string;

  /**
   * Путь страницы (без домена и query параметров)
   */
  pathname: string;

  /**
   * Timestamp сбора метрики (ISO 8601)
   */
  timestamp: string;

  /**
   * User Agent браузера
   */
  userAgent: string;

  /**
   * Тип соединения (если доступно)
   */
  connectionType?: string;

  /**
   * Effective connection type (4g, 3g, 2g, slow-2g)
   */
  effectiveConnectionType?: string;

  /**
   * Device memory в GB (если доступно)
   */
  deviceMemory?: number;

  /**
   * ID сессии пользователя (для группировки метрик)
   */
  sessionId: string;

  /**
   * Версия приложения / релиза (для сравнения до/после)
   */
  version?: string;

  /**
   * Окружение (production, staging, development)
   */
  environment?: string;
}

/**
 * Ответ от API после сохранения метрики
 */
export interface WebVitalApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Конфигурация Web Vitals мониторинга
 */
export interface WebVitalsConfig {
  /**
   * Включить/выключить отправку метрик
   */
  enabled: boolean;

  /**
   * URL endpoint для отправки метрик
   */
  endpoint: string;

  /**
   * Версия приложения для отслеживания
   */
  version?: string;

  /**
   * Окружение
   */
  environment?: 'production' | 'staging' | 'development';

  /**
   * Отправлять только Core Web Vitals (LCP, FID/INP, CLS)
   */
  coreOnly?: boolean;

  /**
   * Дебаг режим (логирование в консоль)
   */
  debug?: boolean;

  /**
   * Sampling rate (процент пользователей, с которых собираются метрики)
   * Значение от 0 до 1 (1 = 100% пользователей)
   */
  samplingRate?: number;
}

/**
 * Статистика Web Vitals для анализа
 */
export interface WebVitalsStats {
  /**
   * Название метрики
   */
  metric: WebVitalMetricName;

  /**
   * Путь страницы
   */
  pathname: string;

  /**
   * Период анализа
   */
  period: {
    from: string;
    to: string;
  };

  /**
   * Количество замеров
   */
  count: number;

  /**
   * Среднее значение
   */
  average: number;

  /**
   * Медиана (50-й перцентиль)
   */
  median: number;

  /**
   * 75-й перцентиль (используется Google для оценки)
   */
  p75: number;

  /**
   * 95-й перцентиль
   */
  p95: number;

  /**
   * Минимальное значение
   */
  min: number;

  /**
   * Максимальное значение
   */
  max: number;

  /**
   * Распределение по рейтингам
   */
  distribution: {
    good: number;
    needsImprovement: number;
    poor: number;
  };
}

/**
 * Глобальный тип для window объекта с поддержкой Network Information API
 */
declare global {
  interface Navigator {
    connection?: {
      effectiveType?: string;
      type?: string;
      downlink?: number;
      rtt?: number;
      saveData?: boolean;
    };
    deviceMemory?: number;
  }
}

export {};
