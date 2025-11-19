'use client';

/**
 * Хуки для упрощенного использования аналитики в компонентах
 *
 * Предоставляют готовые функции для отслеживания типичных e-commerce событий
 * с автоматической обработкой ошибок и типизацией
 */

import { useCallback } from 'react';
import { useAnalytics } from '@/context/analytics/AnalyticsProvider';
import { Product } from '@/types/product';
import type { CartItem } from '@/store/useCartStore';

/**
 * Хук для отслеживания событий продуктов
 *
 * @example
 * ```tsx
 * const { trackProductView, trackProductClick } = useProductTracking();
 *
 * useEffect(() => {
 *   trackProductView(product);
 * }, [product]);
 * ```
 */
export function useProductTracking() {
  const analytics = useAnalytics();

  /**
   * Отслеживание просмотра товара
   */
  const trackProductView = useCallback(
    (product: Product) => {
      if (!product) {
        console.warn('trackProductView: product is undefined');
        return;
      }

      try {
        analytics.trackViewProduct({ product });
      } catch (error) {
        console.error('Failed to track product view:', error);
      }
    },
    [analytics],
  );

  /**
   * Отслеживание клика по товару
   */
  const trackProductClick = useCallback(
    (product: Product, position?: number) => {
      if (!product) {
        console.warn('trackProductClick: product is undefined');
        return;
      }

      try {
        analytics.trackEvent({
          category: 'Product',
          action: 'click',
          label: product.name,
          value: position,
          params: {
            product_id: product.id,
            product_category: product.category,
          },
        });
      } catch (error) {
        console.error('Failed to track product click:', error);
      }
    },
    [analytics],
  );

  /**
   * Отслеживание клика "В избранное"
   */
  const trackAddToFavorites = useCallback(
    (product: Product) => {
      if (!product) {
        console.warn('trackAddToFavorites: product is undefined');
        return;
      }

      try {
        analytics.trackEvent({
          category: 'Favorites',
          action: 'add',
          label: product.name,
          params: {
            product_id: product.id,
            product_category: product.category,
            product_price: product.price,
          },
        });

        // Дополнительная цель для Яндекс.Метрики
        if (analytics.trackGoal) {
          analytics.trackGoal('add_to_favorites', {
            product_id: product.id,
          });
        }
      } catch (error) {
        console.error('Failed to track add to favorites:', error);
      }
    },
    [analytics],
  );

  return {
    trackProductView,
    trackProductClick,
    trackAddToFavorites,
  };
}

/**
 * Хук для отслеживания событий корзины
 *
 * @example
 * ```tsx
 * const { trackAddToCart, trackRemoveFromCart } = useCartTracking();
 *
 * const handleAddToCart = () => {
 *   addItem(product);
 *   trackAddToCart(product, 1);
 * };
 * ```
 */
export function useCartTracking() {
  const analytics = useAnalytics();

  /**
   * Отслеживание добавления в корзину
   */
  const trackAddToCart = useCallback(
    (product: Product, quantity: number = 1) => {
      if (!product) {
        console.warn('trackAddToCart: product is undefined');
        return;
      }

      if (quantity <= 0) {
        console.warn('trackAddToCart: quantity must be positive');
        return;
      }

      try {
        analytics.trackAddToCart({ product, quantity });
      } catch (error) {
        console.error('Failed to track add to cart:', error);
      }
    },
    [analytics],
  );

  /**
   * Отслеживание удаления из корзины
   */
  const trackRemoveFromCart = useCallback(
    (product: Product, quantity: number = 1) => {
      if (!product) {
        console.warn('trackRemoveFromCart: product is undefined');
        return;
      }

      try {
        analytics.trackRemoveFromCart({ product, quantity });
      } catch (error) {
        console.error('Failed to track remove from cart:', error);
      }
    },
    [analytics],
  );

  /**
   * Отслеживание изменения количества в корзине
   */
  const trackUpdateCartQuantity = useCallback(
    (product: Product, oldQuantity: number, newQuantity: number) => {
      if (!product) {
        console.warn('trackUpdateCartQuantity: product is undefined');
        return;
      }

      try {
        const diff = newQuantity - oldQuantity;

        if (diff > 0) {
          // Увеличение количества
          analytics.trackAddToCart({ product, quantity: diff });
        } else if (diff < 0) {
          // Уменьшение количества
          analytics.trackRemoveFromCart({ product, quantity: Math.abs(diff) });
        }
      } catch (error) {
        console.error('Failed to track cart quantity update:', error);
      }
    },
    [analytics],
  );

  /**
   * Отслеживание начала оформления заказа
   */
  const trackBeginCheckout = useCallback(
    (items: CartItem[]) => {
      if (!items || items.length === 0) {
        console.warn('trackBeginCheckout: cart is empty');
        return;
      }

      try {
        const totalValue = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );

        analytics.trackBeginCheckout({ items, totalValue });
      } catch (error) {
        console.error('Failed to track begin checkout:', error);
      }
    },
    [analytics],
  );

  return {
    trackAddToCart,
    trackRemoveFromCart,
    trackUpdateCartQuantity,
    trackBeginCheckout,
  };
}

/**
 * Хук для отслеживания событий заказа
 *
 * @example
 * ```tsx
 * const { trackPurchase } = useOrderTracking();
 *
 * const handleOrderComplete = (orderId: string, items: CartItem[]) => {
 *   trackPurchase(orderId, items);
 * };
 * ```
 */
export function useOrderTracking() {
  const analytics = useAnalytics();

  /**
   * Отслеживание завершения покупки
   */
  const trackPurchase = useCallback(
    (
      orderId: string,
      items: CartItem[],
      options?: {
        tax?: number;
        shipping?: number;
        currency?: string;
      },
    ) => {
      if (!orderId) {
        console.warn('trackPurchase: orderId is required');
        return;
      }

      if (!items || items.length === 0) {
        console.warn('trackPurchase: items array is empty');
        return;
      }

      try {
        const totalValue = items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );

        analytics.trackPurchase({
          orderId,
          items,
          totalValue,
          tax: options?.tax,
          shipping: options?.shipping,
          currency: options?.currency,
        });
      } catch (error) {
        console.error('Failed to track purchase:', error);
      }
    },
    [analytics],
  );

  /**
   * Отслеживание начала оформления заказа (форма)
   */
  const trackCheckoutStepViewed = useCallback(
    (step: number, stepName: string) => {
      try {
        analytics.trackEvent({
          category: 'Checkout',
          action: 'step_viewed',
          label: stepName,
          value: step,
        });
      } catch (error) {
        console.error('Failed to track checkout step:', error);
      }
    },
    [analytics],
  );

  /**
   * Отслеживание заполнения формы заказа
   */
  const trackCheckoutFormFilled = useCallback(
    (fieldName: string) => {
      try {
        analytics.trackEvent({
          category: 'Checkout',
          action: 'form_filled',
          label: fieldName,
        });
      } catch (error) {
        console.error('Failed to track checkout form:', error);
      }
    },
    [analytics],
  );

  return {
    trackPurchase,
    trackCheckoutStepViewed,
    trackCheckoutFormFilled,
  };
}

/**
 * Хук для отслеживания пользовательских событий интерфейса
 *
 * @example
 * ```tsx
 * const { trackButtonClick, trackSearch } = useUITracking();
 *
 * const handleSearch = (query: string) => {
 *   trackSearch(query);
 * };
 * ```
 */
export function useUITracking() {
  const analytics = useAnalytics();

  /**
   * Отслеживание клика по кнопке
   */
  const trackButtonClick = useCallback(
    (buttonName: string, location?: string) => {
      try {
        analytics.trackEvent({
          category: 'UI',
          action: 'button_click',
          label: buttonName,
          params: { location },
        });
      } catch (error) {
        console.error('Failed to track button click:', error);
      }
    },
    [analytics],
  );

  /**
   * Отслеживание поиска
   */
  const trackSearch = useCallback(
    (searchQuery: string, resultsCount?: number) => {
      try {
        analytics.trackEvent({
          category: 'Search',
          action: 'search',
          label: searchQuery,
          value: resultsCount,
        });

        // Дополнительная цель для Яндекс.Метрики
        if (analytics.trackGoal) {
          analytics.trackGoal('search', {
            search_query: searchQuery,
            results_count: resultsCount,
          });
        }
      } catch (error) {
        console.error('Failed to track search:', error);
      }
    },
    [analytics],
  );

  /**
   * Отслеживание применения фильтров
   */
  const trackFilterApplied = useCallback(
    (filterType: string, filterValue: string | number) => {
      try {
        analytics.trackEvent({
          category: 'Catalog',
          action: 'filter_applied',
          label: filterType,
          params: {
            filter_type: filterType,
            filter_value: filterValue,
          },
        });
      } catch (error) {
        console.error('Failed to track filter:', error);
      }
    },
    [analytics],
  );

  /**
   * Отслеживание смены категории
   */
  const trackCategoryView = useCallback(
    (categoryName: string) => {
      try {
        analytics.trackEvent({
          category: 'Catalog',
          action: 'category_view',
          label: categoryName,
        });
      } catch (error) {
        console.error('Failed to track category view:', error);
      }
    },
    [analytics],
  );

  /**
   * Отслеживание открытия модального окна
   */
  const trackModalOpen = useCallback(
    (modalName: string) => {
      try {
        analytics.trackEvent({
          category: 'UI',
          action: 'modal_open',
          label: modalName,
        });
      } catch (error) {
        console.error('Failed to track modal open:', error);
      }
    },
    [analytics],
  );

  return {
    trackButtonClick,
    trackSearch,
    trackFilterApplied,
    trackCategoryView,
    trackModalOpen,
  };
}
