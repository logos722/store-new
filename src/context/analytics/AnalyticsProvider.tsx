'use client';

/**
 * Провайдер системы аналитики
 *
 * Интегрирует:
 * - Яндекс.Метрика (основной для СНГ)
 * - Google Analytics 4 (резервный + международная аудитория)
 *
 * Особенности:
 * - Безопасная загрузка скриптов через next/script
 * - Обработка ошибок для каждого провайдера независимо
 * - Поддержка Server Components через клиентский контекст
 * - TypeScript типизация для всех событий
 */

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
} from 'react';
import Script from 'next/script';
import {
  AnalyticsConfig,
  AnalyticsProvider as IAnalyticsProvider,
  AnalyticsEventParams,
  CustomEvent,
  ViewProductEvent,
  AddToCartEvent,
  RemoveFromCartEvent,
  BeginCheckoutEvent,
  PurchaseEvent,
} from '@/types/analytics';

interface AnalyticsContextType extends IAnalyticsProvider {
  isReady: boolean;
}

// Создаем контекст с undefined по умолчанию
const AnalyticsContext = createContext<AnalyticsContextType | undefined>(
  undefined,
);

interface AnalyticsProviderProps {
  config: AnalyticsConfig;
  children: React.ReactNode;
}

export function AnalyticsProvider({
  config,
  children,
}: AnalyticsProviderProps) {
  const [isReady, setIsReady] = React.useState(false);

  // Проверяем готовность аналитики после загрузки скриптов
  useEffect(() => {
    const checkReady = () => {
      const ymReady = config.yandexMetrika
        ? typeof window.ym !== 'undefined'
        : true;
      const gaReady = config.googleAnalytics
        ? typeof window.gtag !== 'undefined'
        : true;

      if (ymReady && gaReady) {
        setIsReady(true);
        if (config.debug) {
          console.log('✅ Аналитика инициализирована:', {
            yandexMetrika: ymReady,
            googleAnalytics: gaReady,
          });
        }
      }
    };

    // Проверяем сразу и через таймауты (на случай асинхронной загрузки)
    checkReady();
    const timer1 = setTimeout(checkReady, 1000);
    const timer2 = setTimeout(checkReady, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [config.yandexMetrika, config.googleAnalytics, config.debug]);

  /**
   * Отслеживание просмотра страницы
   */
  const trackPageView = useCallback(
    (url: string, title?: string) => {
      try {
        // Яндекс.Метрика
        if (config.yandexMetrika && window.ym) {
          window.ym(config.yandexMetrika.id, 'hit', url, {
            title: title || document.title,
          });
        }

        // Google Analytics 4
        if (config.googleAnalytics && window.gtag) {
          window.gtag('config', config.googleAnalytics.measurementId, {
            page_path: url,
            page_title: title,
          });
        }

        if (config.debug) {
          console.log('📊 Page View:', { url, title });
        }
      } catch (error) {
        console.error('Analytics trackPageView error:', error);
      }
    },
    [config],
  );

  /**
   * Отслеживание пользовательского события
   */
  const trackEvent = useCallback(
    (event: CustomEvent) => {
      try {
        // Яндекс.Метрика
        if (config.yandexMetrika && window.ym) {
          window.ym(config.yandexMetrika.id, 'reachGoal', event.action, {
            category: event.category,
            label: event.label,
            value: event.value,
            ...event.params,
          });
        }

        // Google Analytics 4
        if (config.googleAnalytics && window.gtag) {
          window.gtag('event', event.action, {
            event_category: event.category,
            event_label: event.label,
            value: event.value,
            ...event.params,
          });
        }

        if (config.debug) {
          console.log('📊 Event:', event);
        }
      } catch (error) {
        console.error('Analytics trackEvent error:', error);
      }
    },
    [config],
  );

  /**
   * E-commerce: Просмотр товара
   */
  const trackViewProduct = useCallback(
    (event: ViewProductEvent) => {
      try {
        const { product, currency = 'RUB' } = event;

        // Яндекс.Метрика (ecommerce)
        if (config.yandexMetrika && window.ym) {
          window.ym(config.yandexMetrika.id, 'reachGoal', 'view_product');

          // Отправляем данные в dataLayer для ecommerce
          if (config.yandexMetrika.ecommerce) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              ecommerce: {
                currencyCode: currency,
                detail: {
                  products: [
                    {
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      brand: product.brand || 'Гелион',
                      category: product.category,
                    },
                  ],
                },
              },
            });
          }
        }

        // Google Analytics 4
        if (config.googleAnalytics && window.gtag) {
          window.gtag('event', 'view_item', {
            currency,
            value: product.price,
            items: [
              {
                item_id: product.id,
                item_name: product.name,
                item_brand: product.brand || 'Гелион',
                item_category: product.category,
                price: product.price,
              },
            ],
          });
        }

        if (config.debug) {
          console.log('📊 View Product:', event);
        }
      } catch (error) {
        console.error('Analytics trackViewProduct error:', error);
      }
    },
    [config],
  );

  /**
   * E-commerce: Добавление в корзину
   */
  const trackAddToCart = useCallback(
    (event: AddToCartEvent) => {
      try {
        const { product, quantity, currency = 'RUB' } = event;

        // Яндекс.Метрика
        if (config.yandexMetrika && window.ym) {
          window.ym(config.yandexMetrika.id, 'reachGoal', 'add_to_cart');

          if (config.yandexMetrika.ecommerce) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              ecommerce: {
                currencyCode: currency,
                add: {
                  products: [
                    {
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      brand: product.brand || 'Гелион',
                      category: product.category,
                      quantity,
                    },
                  ],
                },
              },
            });
          }
        }

        // Google Analytics 4
        if (config.googleAnalytics && window.gtag) {
          window.gtag('event', 'add_to_cart', {
            currency,
            value: product.price * quantity,
            items: [
              {
                item_id: product.id,
                item_name: product.name,
                item_brand: product.brand || 'Гелион',
                item_category: product.category,
                price: product.price,
                quantity,
              },
            ],
          });
        }

        if (config.debug) {
          console.log('📊 Add to Cart:', event);
        }
      } catch (error) {
        console.error('Analytics trackAddToCart error:', error);
      }
    },
    [config],
  );

  /**
   * E-commerce: Удаление из корзины
   */
  const trackRemoveFromCart = useCallback(
    (event: RemoveFromCartEvent) => {
      try {
        const { product, quantity, currency = 'RUB' } = event;

        // Яндекс.Метрика
        if (config.yandexMetrika && window.ym) {
          window.ym(config.yandexMetrika.id, 'reachGoal', 'remove_from_cart');

          if (config.yandexMetrika.ecommerce) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              ecommerce: {
                currencyCode: currency,
                remove: {
                  products: [
                    {
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      brand: product.brand || 'Гелион',
                      category: product.category,
                      quantity,
                    },
                  ],
                },
              },
            });
          }
        }

        // Google Analytics 4
        if (config.googleAnalytics && window.gtag) {
          window.gtag('event', 'remove_from_cart', {
            currency,
            value: product.price * quantity,
            items: [
              {
                item_id: product.id,
                item_name: product.name,
                item_brand: product.brand || 'Гелион',
                item_category: product.category,
                price: product.price,
                quantity,
              },
            ],
          });
        }

        if (config.debug) {
          console.log('📊 Remove from Cart:', event);
        }
      } catch (error) {
        console.error('Analytics trackRemoveFromCart error:', error);
      }
    },
    [config],
  );

  /**
   * E-commerce: Начало оформления заказа
   */
  const trackBeginCheckout = useCallback(
    (event: BeginCheckoutEvent) => {
      try {
        const { items, totalValue, currency = 'RUB' } = event;

        // Яндекс.Метрика
        if (config.yandexMetrika && window.ym) {
          window.ym(config.yandexMetrika.id, 'reachGoal', 'begin_checkout');

          if (config.yandexMetrika.ecommerce) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              ecommerce: {
                currencyCode: currency,
                checkout: {
                  products: items.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    brand: item.brand || 'Гелион',
                    category: item.category,
                    quantity: item.quantity,
                  })),
                },
              },
            });
          }
        }

        // Google Analytics 4
        if (config.googleAnalytics && window.gtag) {
          window.gtag('event', 'begin_checkout', {
            currency,
            value: totalValue,
            items: items.map(item => ({
              item_id: item.id,
              item_name: item.name,
              item_brand: item.brand || 'Гелион',
              item_category: item.category,
              price: item.price,
              quantity: item.quantity,
            })),
          });
        }

        if (config.debug) {
          console.log('📊 Begin Checkout:', event);
        }
      } catch (error) {
        console.error('Analytics trackBeginCheckout error:', error);
      }
    },
    [config],
  );

  /**
   * E-commerce: Покупка
   */
  const trackPurchase = useCallback(
    (event: PurchaseEvent) => {
      try {
        const {
          orderId,
          items,
          totalValue,
          currency = 'RUB',
          tax,
          shipping,
        } = event;

        // Яндекс.Метрика
        if (config.yandexMetrika && window.ym) {
          window.ym(config.yandexMetrika.id, 'reachGoal', 'purchase');

          if (config.yandexMetrika.ecommerce) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              ecommerce: {
                currencyCode: currency,
                purchase: {
                  actionField: {
                    id: orderId,
                    revenue: totalValue,
                    tax: tax || 0,
                    shipping: shipping || 0,
                  },
                  products: items.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    brand: item.brand || 'Гелион',
                    category: item.category,
                    quantity: item.quantity,
                  })),
                },
              },
            });
          }
        }

        // Google Analytics 4
        if (config.googleAnalytics && window.gtag) {
          window.gtag('event', 'purchase', {
            transaction_id: orderId,
            currency,
            value: totalValue,
            tax: tax || 0,
            shipping: shipping || 0,
            items: items.map(item => ({
              item_id: item.id,
              item_name: item.name,
              item_brand: item.brand || 'Гелион',
              item_category: item.category,
              price: item.price,
              quantity: item.quantity,
            })),
          });
        }

        if (config.debug) {
          console.log('📊 Purchase:', event);
        }
      } catch (error) {
        console.error('Analytics trackPurchase error:', error);
      }
    },
    [config],
  );

  /**
   * Отслеживание цели (специфично для Яндекс.Метрики)
   */
  const trackGoal = useCallback(
    (goalId: string, params?: Record<string, AnalyticsEventParams>) => {
      try {
        if (config.yandexMetrika && window.ym) {
          window.ym(config.yandexMetrika.id, 'reachGoal', goalId, params);

          if (config.debug) {
            console.log('📊 Goal:', { goalId, params });
          }
        }
      } catch (error) {
        console.error('Analytics trackGoal error:', error);
      }
    },
    [config],
  );

  const contextValue: AnalyticsContextType = {
    isReady,
    trackPageView,
    trackEvent,
    trackViewProduct,
    trackAddToCart,
    trackRemoveFromCart,
    trackBeginCheckout,
    trackPurchase,
    trackGoal,
  };

  return (
    <>
      {/* Яндекс.Метрика */}
      {config.yandexMetrika && (
        <>
          <Script
            id="yandex-metrika"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(m,e,t,r,i,k,a){
                  m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                  m[i].l=1*new Date();
                  for (var j = 0; j < document.scripts.length; j++) {
                    if (document.scripts[j].src === r) { return; }
                  }
                  k=e.createElement(t),a=e.getElementsByTagName(t)[0],
                  k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
                })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

                ym(${config.yandexMetrika.id}, "init", {
                  clickmap:${config.yandexMetrika.clickmap ?? true},
                  trackLinks:${config.yandexMetrika.trackLinks ?? true},
                  accurateTrackBounce:${config.yandexMetrika.accurateTrackBounce ?? true},
                  webvisor:${config.yandexMetrika.webvisor ?? false},
                  ecommerce:"${config.yandexMetrika.ecommerce ? 'dataLayer' : ''}",
                  triggerEvent:${config.yandexMetrika.triggerEvent ?? true}
                });
              `,
            }}
          />
          <noscript>
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://mc.yandex.ru/watch/${config.yandexMetrika.id}`}
                style={{ position: 'absolute', left: '-9999px' }}
                alt=""
              />
            </div>
          </noscript>
        </>
      )}

      {/* Google Analytics 4 */}
      {config.googleAnalytics && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${config.googleAnalytics.measurementId}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${config.googleAnalytics.measurementId}', {
                  page_path: window.location.pathname,
                  send_page_view: true
                });
              `,
            }}
          />
        </>
      )}

      <AnalyticsContext.Provider value={contextValue}>
        {children}
      </AnalyticsContext.Provider>
    </>
  );
}

/**
 * Хук для использования аналитики в компонентах
 *
 * @example
 * ```tsx
 * const { trackAddToCart, isReady } = useAnalytics();
 *
 * const handleAddToCart = () => {
 *   trackAddToCart({ product, quantity: 1 });
 * };
 * ```
 */
export function useAnalytics() {
  const context = useContext(AnalyticsContext);

  if (context === undefined) {
    throw new Error('useAnalytics must be used within AnalyticsProvider');
  }

  return context;
}
