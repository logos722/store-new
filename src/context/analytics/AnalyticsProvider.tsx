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
  hasConsent: boolean;
  setConsent: (hasConsent: boolean) => void;
}

// Создаем контекст с undefined по умолчанию
const AnalyticsContext = createContext<AnalyticsContextType | undefined>(
  undefined,
);

interface AnalyticsProviderProps {
  config: AnalyticsConfig;
  children: React.ReactNode;
}

/**
 * Константы для работы с Cookie Consent
 */
const CONSENT_STORAGE_KEY = 'cookie-consent';
const CONSENT_VERSION = '1';

/**
 * Получить сохраненное согласие из localStorage
 * КРИТИЧНО: Должно выполняться синхронно при инициализации
 */
function getInitialConsent(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return false;

    const parsed = JSON.parse(stored);

    // Проверяем версию согласия
    if (parsed.version !== CONSENT_VERSION) {
      return false;
    }

    // Возвращаем только analytics consent
    return parsed.preferences?.analytics || false;
  } catch (error) {
    console.error('Error reading initial consent:', error);
    return false;
  }
}

export function AnalyticsProvider({
  config,
  children,
}: AnalyticsProviderProps) {
  const [isReady, setIsReady] = React.useState(false);

  // ИСПРАВЛЕНИЕ КРИТИЧЕСКОГО БАГА:
  // Инициализируем hasConsent из localStorage при первом рендере
  // Это предотвращает race condition с CookieConsent компонентом
  const [hasConsent, setHasConsent] = React.useState(() => {
    // Если requireConsent=false, сразу разрешаем
    if (!config.requireConsent) {
      return true;
    }

    // Проверяем, нужен ли consent (есть ли хотя бы одна аналитика)
    const needsConsent = !!(config.yandexMetrika || config.googleAnalytics);
    if (!needsConsent) {
      return true;
    }

    // Читаем сохраненное согласие из localStorage
    const storedConsent = getInitialConsent();

    if (config.debug) {
      console.log('🔍 Analytics Initial Consent:', {
        stored: storedConsent,
        requireConsent: config.requireConsent,
        needsConsent,
      });
    }

    return storedConsent;
  });

  /**
   * Хелпер для безопасного выполнения аналитики с проверкой согласия
   */
  const executeWithConsent = useCallback(
    (callback: () => void, eventName: string) => {
      if (!hasConsent) {
        if (config.debug) {
          console.log(`📊 ${eventName} blocked: no consent`);
        }
        return;
      }

      try {
        callback();
      } catch (error) {
        console.error(`Analytics ${eventName} error:`, error);
      }
    },
    [hasConsent, config.debug],
  );

  // Проверяем готовность аналитики после загрузки скриптов
  useEffect(() => {
    const checkReady = () => {
      const ymReady = config.yandexMetrika
        ? typeof window.ym !== 'undefined'
        : true;
      const gaReady = config.googleAnalytics
        ? typeof window.gtag !== 'undefined'
        : true;

      if (config.debug) {
        console.log('🔍 Checking Analytics Ready:', {
          ymReady,
          gaReady,
          hasConsent,
          yandexEnabled: !!config.yandexMetrika,
          gaEnabled: !!config.googleAnalytics,
        });
      }

      if (ymReady && gaReady) {
        setIsReady(true);
        if (config.debug) {
          console.log('✅ Аналитика инициализирована:', {
            yandexMetrika: ymReady,
            googleAnalytics: gaReady,
            hasConsent,
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
  }, [config.yandexMetrika, config.googleAnalytics, config.debug, hasConsent]);

  /**
   * Отслеживание просмотра страницы
   */
  const trackPageView = useCallback(
    (url: string, title?: string) => {
      // Не отправляем события, если нет согласия
      if (!hasConsent) {
        if (config.debug) {
          console.log('📊 Page View blocked: no consent');
        }
        return;
      }

      try {
        // Яндекс.Метрика
        if (config.yandexMetrika && window.ym) {
          try {
            window.ym(config.yandexMetrika.id, 'hit', url, {
              title: title || document.title,
            });
          } catch (error) {
            console.error('Yandex.Metrika trackPageView error:', error);
          }
        }

        // Google Analytics 4
        if (config.googleAnalytics && window.gtag) {
          try {
            window.gtag('config', config.googleAnalytics.measurementId, {
              page_path: url,
              page_title: title,
            });
          } catch (error) {
            console.error('Google Analytics trackPageView error:', error);
          }
        }

        if (config.debug) {
          console.log('📊 Page View:', { url, title });
        }
      } catch (error) {
        console.error('Analytics trackPageView error:', error);
      }
    },
    [config, hasConsent],
  );

  /**
   * Отслеживание пользовательского события
   */
  const trackEvent = useCallback(
    (event: CustomEvent) => {
      // Не отправляем события, если нет согласия
      if (!hasConsent) {
        if (config.debug) {
          console.log('📊 Event blocked: no consent', event);
        }
        return;
      }

      try {
        // Яндекс.Метрика
        if (config.yandexMetrika && window.ym) {
          try {
            window.ym(config.yandexMetrika.id, 'reachGoal', event.action, {
              category: event.category,
              label: event.label,
              value: event.value,
              ...event.params,
            });
          } catch (error) {
            console.error('Yandex.Metrika trackEvent error:', error);
          }
        }

        // Google Analytics 4
        if (config.googleAnalytics && window.gtag) {
          try {
            window.gtag('event', event.action, {
              event_category: event.category,
              event_label: event.label,
              value: event.value,
              ...event.params,
            });
          } catch (error) {
            console.error('Google Analytics trackEvent error:', error);
          }
        }

        if (config.debug) {
          console.log('📊 Event:', event);
        }
      } catch (error) {
        console.error('Analytics trackEvent error:', error);
      }
    },
    [config, hasConsent],
  );

  /**
   * E-commerce: Просмотр товара
   */
  const trackViewProduct = useCallback(
    (event: ViewProductEvent) => {
      executeWithConsent(() => {
        const { product, currency = 'RUB' } = event;

        // Яндекс.Метрика (ecommerce)
        if (config.yandexMetrika && window.ym) {
          try {
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
          } catch (error) {
            console.error('Yandex.Metrika trackViewProduct error:', error);
          }
        }

        // Google Analytics 4
        if (config.googleAnalytics && window.gtag) {
          try {
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
          } catch (error) {
            console.error('Google Analytics trackViewProduct error:', error);
          }
        }

        if (config.debug) {
          console.log('📊 View Product:', event);
        }
      }, 'trackViewProduct');
    },
    [config, executeWithConsent],
  );

  /**
   * E-commerce: Добавление в корзину
   */
  const trackAddToCart = useCallback(
    (event: AddToCartEvent) => {
      executeWithConsent(() => {
        const { product, quantity, currency = 'RUB' } = event;

        // Яндекс.Метрика
        if (config.yandexMetrika && window.ym) {
          try {
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
          } catch (error) {
            console.error('Yandex.Metrika trackAddToCart error:', error);
          }
        }

        // Google Analytics 4
        if (config.googleAnalytics && window.gtag) {
          try {
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
          } catch (error) {
            console.error('Google Analytics trackAddToCart error:', error);
          }
        }

        if (config.debug) {
          console.log('📊 Add to Cart:', event);
        }
      }, 'trackAddToCart');
    },
    [config, executeWithConsent],
  );

  /**
   * E-commerce: Удаление из корзины
   */
  const trackRemoveFromCart = useCallback(
    (event: RemoveFromCartEvent) => {
      executeWithConsent(() => {
        const { product, quantity, currency = 'RUB' } = event;

        // Яндекс.Метрика
        if (config.yandexMetrika && window.ym) {
          try {
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
          } catch (error) {
            console.error('Yandex.Metrika trackRemoveFromCart error:', error);
          }
        }

        // Google Analytics 4
        if (config.googleAnalytics && window.gtag) {
          try {
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
          } catch (error) {
            console.error('Google Analytics trackRemoveFromCart error:', error);
          }
        }

        if (config.debug) {
          console.log('📊 Remove from Cart:', event);
        }
      }, 'trackRemoveFromCart');
    },
    [config, executeWithConsent],
  );

  /**
   * E-commerce: Начало оформления заказа
   */
  const trackBeginCheckout = useCallback(
    (event: BeginCheckoutEvent) => {
      executeWithConsent(() => {
        const { items, totalValue, currency = 'RUB' } = event;

        // Яндекс.Метрика
        if (config.yandexMetrika && window.ym) {
          try {
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
          } catch (error) {
            console.error('Yandex.Metrika trackBeginCheckout error:', error);
          }
        }

        // Google Analytics 4
        if (config.googleAnalytics && window.gtag) {
          try {
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
          } catch (error) {
            console.error('Google Analytics trackBeginCheckout error:', error);
          }
        }

        if (config.debug) {
          console.log('📊 Begin Checkout:', event);
        }
      }, 'trackBeginCheckout');
    },
    [config, executeWithConsent],
  );

  /**
   * E-commerce: Покупка
   */
  const trackPurchase = useCallback(
    (event: PurchaseEvent) => {
      executeWithConsent(() => {
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
          try {
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
          } catch (error) {
            console.error('Yandex.Metrika trackPurchase error:', error);
          }
        }

        // Google Analytics 4
        if (config.googleAnalytics && window.gtag) {
          try {
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
          } catch (error) {
            console.error('Google Analytics trackPurchase error:', error);
          }
        }

        if (config.debug) {
          console.log('📊 Purchase:', event);
        }
      }, 'trackPurchase');
    },
    [config, executeWithConsent],
  );

  /**
   * Отслеживание цели (специфично для Яндекс.Метрики)
   */
  const trackGoal = useCallback(
    (goalId: string, params?: Record<string, AnalyticsEventParams>) => {
      executeWithConsent(() => {
        if (config.yandexMetrika && window.ym) {
          try {
            window.ym(config.yandexMetrika.id, 'reachGoal', goalId, params);

            if (config.debug) {
              console.log('📊 Goal:', { goalId, params });
            }
          } catch (error) {
            console.error('Yandex.Metrika trackGoal error:', error);
          }
        }
      }, 'trackGoal');
    },
    [config, executeWithConsent],
  );

  // Обертка для setConsent с логированием
  const setConsentWithLogging = useCallback(
    (consent: boolean) => {
      if (config.debug) {
        console.log('🍪 Consent Changed:', {
          from: hasConsent,
          to: consent,
          timestamp: new Date().toISOString(),
        });
      }
      setHasConsent(consent);
    },
    [config.debug, hasConsent],
  );

  const contextValue: AnalyticsContextType = {
    isReady,
    hasConsent,
    setConsent: setConsentWithLogging,
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
      {/* 
        ⚡ ОПТИМИЗАЦИЯ ЗАГРУЗКИ АНАЛИТИКИ
        
        Изменено: strategy="afterInteractive" → strategy="lazyOnload"
        
        ПРЕИМУЩЕСТВА:
        - Скрипты загружаются ПОСЛЕ полной загрузки страницы (после onLoad)
        - Не блокируют FCP, LCP и другие Core Web Vitals
        - Не влияют на TBT (Total Blocking Time)
        
        НЕДОСТАТКИ:
        - Небольшая задержка в начале отслеживания (~1-2 сек)
        - Может пропустить очень быстрые взаимодействия
        
        КОМПРОМИСС: Производительность важнее мгновенной аналитики
        
        🍪 COOKIE CONSENT:
        - Скрипты загружаются только после согласия пользователя (hasConsent)
        - Соответствует GDPR и требованиям по приватности
        - Если аналитика отключена через env, скрипты не загружаются вообще
      */}

      {/* Яндекс.Метрика */}
      {config.yandexMetrika && hasConsent && (
        <>
          <Script
            id="yandex-metrika"
            strategy="lazyOnload"
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
      {config.googleAnalytics && hasConsent && (
        <>
          <Script
            strategy="lazyOnload"
            src={`https://www.googletagmanager.com/gtag/js?id=${config.googleAnalytics.measurementId}`}
          />
          <Script
            id="google-analytics"
            strategy="lazyOnload"
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
