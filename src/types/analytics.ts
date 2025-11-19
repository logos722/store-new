/**
 * Типы для системы продуктовой аналитики
 *
 * Поддерживаемые провайдеры:
 * - Яндекс.Метрика (приоритет для СНГ рынка)
 * - Google Analytics 4
 */

import { Product } from './product';
import type { CartItem } from '@/store/useCartStore';

/**
 * E-commerce событие для добавления в корзину
 */
export interface AddToCartEvent {
  product: Product;
  quantity: number;
  currency?: string;
}

/**
 * E-commerce событие для удаления из корзины
 */
export interface RemoveFromCartEvent {
  product: Product;
  quantity: number;
  currency?: string;
}

/**
 * E-commerce событие для просмотра товара
 */
export interface ViewProductEvent {
  product: Product;
  currency?: string;
}

/**
 * E-commerce событие для начала оформления заказа
 */
export interface BeginCheckoutEvent {
  items: CartItem[];
  totalValue: number;
  currency?: string;
}

/**
 * E-commerce событие для завершения покупки
 */
export interface PurchaseEvent {
  orderId: string;
  items: CartItem[];
  totalValue: number;
  currency?: string;
  tax?: number;
  shipping?: number;
}

/**
 * Базовый тип для параметров событий аналитики
 */
export type AnalyticsEventParams =
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<string, string | number | boolean | null | undefined>;

/**
 * Общее событие с кастомными параметрами
 */
export interface CustomEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  params?: Record<string, AnalyticsEventParams>;
}

/**
 * Конфигурация Яндекс.Метрики
 */
export interface YandexMetrikaConfig {
  id: string;
  clickmap?: boolean;
  trackLinks?: boolean;
  accurateTrackBounce?: boolean;
  webvisor?: boolean;
  ecommerce?: boolean;
  triggerEvent?: boolean;
}

/**
 * Конфигурация Google Analytics 4
 */
export interface GoogleAnalyticsConfig {
  measurementId: string;
}

/**
 * Объединенная конфигурация аналитики
 */
export interface AnalyticsConfig {
  yandexMetrika?: YandexMetrikaConfig;
  googleAnalytics?: GoogleAnalyticsConfig;
  debug?: boolean;
}

/**
 * Тип для параметров Яндекс.Метрики
 */
export type YandexMetrikaParams =
  | string
  | number
  | boolean
  | null
  | undefined
  | Record<string, unknown>
  | Array<unknown>;

/**
 * Тип для объектов dataLayer
 */
export interface DataLayerObject {
  event?: string;
  ecommerce?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Типы для Google Analytics 4 параметров
 */
export type GtagEventParams = Record<string, unknown>;

/**
 * Глобальные типы для window объектов аналитики
 */
declare global {
  interface Window {
    // Яндекс.Метрика
    ym?: (
      counterId: string | number,
      method: string,
      ...params: YandexMetrikaParams[]
    ) => void;

    // Google Analytics 4 (gtag)
    gtag?: (
      command: string,
      targetId: string,
      params?: GtagEventParams,
    ) => void;

    // DataLayer для GA4
    dataLayer?: DataLayerObject[];
  }
}

/**
 * Интерфейс провайдера аналитики
 */
export interface AnalyticsProvider {
  /**
   * Отслеживание просмотра страницы
   */
  trackPageView: (url: string, title?: string) => void;

  /**
   * Отслеживание события
   */
  trackEvent: (event: CustomEvent) => void;

  /**
   * E-commerce: Просмотр товара
   */
  trackViewProduct: (event: ViewProductEvent) => void;

  /**
   * E-commerce: Добавление в корзину
   */
  trackAddToCart: (event: AddToCartEvent) => void;

  /**
   * E-commerce: Удаление из корзины
   */
  trackRemoveFromCart: (event: RemoveFromCartEvent) => void;

  /**
   * E-commerce: Начало оформления заказа
   */
  trackBeginCheckout: (event: BeginCheckoutEvent) => void;

  /**
   * E-commerce: Покупка
   */
  trackPurchase: (event: PurchaseEvent) => void;

  /**
   * Отслеживание цели (для Яндекс.Метрики)
   */
  trackGoal?: (
    goalId: string,
    params?: Record<string, AnalyticsEventParams>,
  ) => void;
}
