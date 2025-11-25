'use client';

/**
 * Провайдер системы аналитики с интегрированным Cookie уведомлением
 *
 * Интегрирует:
 * - Яндекс.Метрика (основной для СНГ)
 * - Google Analytics 4 (резервный + международная аудитория)
 * - Информационный баннер о cookies (не требует согласия, только уведомляет)
 *
 * Особенности:
 * - Безопасная загрузка скриптов через next/script
 * - Обработка ошибок для каждого провайдера независимо
 * - Поддержка Server Components через клиентский контекст
 * - TypeScript типизация для всех событий
 * - Аналитика загружается сразу (без ожидания согласия)
 * - Информационный баннер показывается один раз
 */

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
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
import styles from '@/components/cookieConsent/CookieConsent.module.scss';

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

/**
 * Константы для работы с Cookie уведомлением
 * (Информационный баннер, не запрос согласия)
 */
const COOKIE_NOTICE_KEY = 'cookie-notice-acknowledged';
const NOTICE_VERSION = '1';

/**
 * Проверить, было ли показано уведомление о cookies
 */
function wasNoticeShown(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const stored = localStorage.getItem(COOKIE_NOTICE_KEY);
    if (!stored) return false;

    const parsed = JSON.parse(stored);

    // Проверяем версию уведомления
    if (parsed.version !== NOTICE_VERSION) {
      return false;
    }

    return parsed.acknowledged === true;
  } catch (error) {
    console.error('Error reading cookie notice:', error);
    return false;
  }
}

/**
 * Сохранить факт показа уведомления
 */
function markNoticeAsShown(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(
      COOKIE_NOTICE_KEY,
      JSON.stringify({
        version: NOTICE_VERSION,
        acknowledged: true,
        timestamp: new Date().toISOString(),
      }),
    );
  } catch (error) {
    console.error('Error saving cookie notice:', error);
  }
}

/**
 * Компонент информационного уведомления о cookies
 *
 * УПРОЩЕННАЯ ВЕРСИЯ:
 * - Показывается один раз при первом посещении
 * - Не блокирует загрузку аналитики
 * - Только информирует пользователя (одна кнопка "Понятно")
 * - Минималистичный дизайн
 */
interface CookieNoticeProps {
  onClose: () => void;
}

function CookieNotice({ onClose }: CookieNoticeProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.banner} role="dialog" aria-label="Cookie notice">
        <div className={styles.content}>
          <h3 className={styles.title}>🍪 Мы используем cookies</h3>

          <p className={styles.description}>
            Наш сайт использует cookies для улучшения работы и анализа
            посещаемости. Продолжая использовать сайт, вы соглашаетесь с
            использованием cookies. Ваши данные обрабатываются в соответствии с
            политикой конфиденциальности.
          </p>

          <div className={styles.actions}>
            <button
              className={`${styles.button} ${styles.buttonPrimary}`}
              onClick={onClose}
              type="button"
              aria-label="Закрыть уведомление о cookies"
            >
              Понятно
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AnalyticsProvider({
  config,
  children,
}: AnalyticsProviderProps) {
  const [isReady, setIsReady] = useState(false);

  // Состояние для показа информационного баннера о cookies
  const [showNotice, setShowNotice] = useState(false);

  // Проверяем, нужно ли показать уведомление при монтировании
  useEffect(() => {
    // Показываем только если есть хотя бы одна аналитика и уведомление не было показано
    const hasAnalytics = !!(config.yandexMetrika || config.googleAnalytics);
    const noticeWasShown = wasNoticeShown();

    if (hasAnalytics && !noticeWasShown) {
      // Небольшая задержка для улучшения UX (не показываем сразу при загрузке)
      const timer = setTimeout(() => {
        setShowNotice(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [config.yandexMetrika, config.googleAnalytics]);

  /**
   * Обработчик закрытия уведомления о cookies
   */
  const handleNoticeAcknowledge = useCallback(() => {
    markNoticeAsShown();
    setShowNotice(false);

    if (config.debug) {
      console.log('🍪 Cookie notice acknowledged');
    }
  }, [config.debug]);

  /**
   * Хелпер для безопасного выполнения аналитики
   * (без проверки согласия - аналитика всегда работает)
   */
  const executeAnalytics = useCallback(
    (callback: () => void, eventName: string) => {
      try {
        callback();
      } catch (error) {
        console.error(`Analytics ${eventName} error:`, error);
      }
    },
    [],
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
    [config],
  );

  /**
   * E-commerce: Просмотр товара
   */
  const trackViewProduct = useCallback(
    (event: ViewProductEvent) => {
      executeAnalytics(() => {
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
    [config, executeAnalytics],
  );

  /**
   * E-commerce: Добавление в корзину
   */
  const trackAddToCart = useCallback(
    (event: AddToCartEvent) => {
      executeAnalytics(() => {
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
    [config, executeAnalytics],
  );

  /**
   * E-commerce: Удаление из корзины
   */
  const trackRemoveFromCart = useCallback(
    (event: RemoveFromCartEvent) => {
      executeAnalytics(() => {
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
    [config, executeAnalytics],
  );

  /**
   * E-commerce: Начало оформления заказа
   */
  const trackBeginCheckout = useCallback(
    (event: BeginCheckoutEvent) => {
      executeAnalytics(() => {
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
    [config, executeAnalytics],
  );

  /**
   * E-commerce: Покупка
   */
  const trackPurchase = useCallback(
    (event: PurchaseEvent) => {
      executeAnalytics(() => {
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
    [config, executeAnalytics],
  );

  /**
   * Отслеживание цели (специфично для Яндекс.Метрики)
   */
  const trackGoal = useCallback(
    (goalId: string, params?: Record<string, AnalyticsEventParams>) => {
      executeAnalytics(() => {
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
    [config, executeAnalytics],
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
        
        🍪 COOKIE УВЕДОМЛЕНИЕ (НЕ CONSENT):
        - Скрипты загружаются сразу при наличии конфигурации
        - Информационный баннер показывается отдельно (не блокирует аналитику)
        - Если аналитика отключена через env, скрипты не загружаются вообще
      */}

      {/* Яндекс.Метрика */}
      {config.yandexMetrika && (
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
      {config.googleAnalytics && (
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

        {/* 
          🍪 ИНФОРМАЦИОННЫЙ БАННЕР О COOKIES
          
          Показывается один раз при первом посещении сайта.
          НЕ блокирует загрузку аналитики (чисто информационный).
          Соответствует требованиям законодательства о прозрачности.
        */}
        {showNotice && <CookieNotice onClose={handleNoticeAcknowledge} />}
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
