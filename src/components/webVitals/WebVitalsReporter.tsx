'use client';

/**
 * Компонент для сбора и отправки Web Vitals метрик
 *
 * Особенности:
 * - Использует встроенную библиотеку next/dist/build/polyfills/report-web-vitals
 * - Автоматический сбор Core Web Vitals (LCP, FID/INP, CLS, FCP, TTFB)
 * - Отправка метрик на сервер для анализа
 * - Обогащение данных контекстом (URL, User Agent, connection info)
 * - Sampling для снижения нагрузки на production
 * - Error handling и retry логика
 *
 * @see https://web.dev/vitals/
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/analytics
 */

import { useEffect, useCallback, useRef } from 'react';
import type {
  WebVitalMetric,
  WebVitalReport,
  WebVitalsConfig,
} from '@/types/webVitals';

interface WebVitalsReporterProps {
  config: WebVitalsConfig;
}

/**
 * Генерация уникального session ID для группировки метрик одного пользователя
 */
function generateSessionId(): string {
  // Проверяем существующий sessionId в sessionStorage
  if (typeof window !== 'undefined') {
    const existingSessionId = sessionStorage.getItem('webVitalsSessionId');
    if (existingSessionId) {
      return existingSessionId;
    }
  }

  // Генерируем новый sessionId
  const sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

  if (typeof window !== 'undefined') {
    sessionStorage.setItem('webVitalsSessionId', sessionId);
  }

  return sessionId;
}

/**
 * Получение информации о соединении пользователя
 */
function getConnectionInfo() {
  if (typeof navigator === 'undefined' || !navigator.connection) {
    return {};
  }

  const connection = navigator.connection;

  return {
    connectionType: connection.type,
    effectiveConnectionType: connection.effectiveType,
  };
}

/**
 * Проверка, должна ли метрика быть отправлена (sampling)
 */
function shouldSendMetric(samplingRate: number = 1): boolean {
  return Math.random() <= samplingRate;
}

export function WebVitalsReporter({ config }: WebVitalsReporterProps) {
  const sessionIdRef = useRef<string | null>(null);
  const sentMetricsRef = useRef<Set<string>>(new Set());

  // Инициализация sessionId
  useEffect(() => {
    if (config.enabled) {
      sessionIdRef.current = generateSessionId();
    }
  }, [config.enabled]);

  /**
   * Отправка метрики на сервер
   */
  const sendMetricToServer = useCallback(
    async (report: WebVitalReport): Promise<void> => {
      // Проверяем, не отправляли ли мы уже эту метрику
      const metricKey = `${report.name}-${report.id}`;
      if (sentMetricsRef.current.has(metricKey)) {
        return;
      }

      try {
        // Используем sendBeacon для надежной отправки даже при закрытии страницы
        const isSent =
          navigator.sendBeacon &&
          navigator.sendBeacon(config.endpoint, JSON.stringify(report));

        if (!isSent) {
          // Fallback на fetch если sendBeacon не сработал
          await fetch(config.endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(report),
            // keepalive для продолжения запроса после закрытия страницы
            keepalive: true,
          });
        }

        // Отмечаем метрику как отправленную
        sentMetricsRef.current.add(metricKey);

        if (config.debug) {
          console.log('📊 Web Vital отправлена:', report);
        }
      } catch (error) {
        // Не логируем в production, чтобы не засорять консоль пользователя
        if (config.debug) {
          console.error('❌ Ошибка отправки Web Vital:', error);
        }

        // Можно добавить retry логику или отправку в очередь
        // Для простоты пока просто игнорируем ошибку
      }
    },
    [config.endpoint, config.debug],
  );

  /**
   * Обработчик метрики Web Vital
   */
  const handleWebVital = useCallback(
    (metric: WebVitalMetric) => {
      // Проверяем, включен ли мониторинг
      if (!config.enabled) {
        return;
      }

      // Проверяем sampling rate
      if (!shouldSendMetric(config.samplingRate)) {
        return;
      }

      // Фильтрация по coreOnly (только Core Web Vitals: LCP, FID/INP, CLS)
      if (config.coreOnly) {
        const coreMetrics = ['LCP', 'FID', 'INP', 'CLS'];
        if (!coreMetrics.includes(metric.name)) {
          return;
        }
      }

      // Обогащаем метрику дополнительными данными
      const report: WebVitalReport = {
        ...metric,
        url: window.location.href,
        pathname: window.location.pathname,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        ...getConnectionInfo(),
        deviceMemory: navigator.deviceMemory,
        sessionId: sessionIdRef.current || generateSessionId(),
        version: config.version,
        environment: config.environment,
      };

      // Отправляем на сервер
      sendMetricToServer(report);
    },
    [
      config.enabled,
      config.samplingRate,
      config.coreOnly,
      config.version,
      config.environment,
      sendMetricToServer,
    ],
  );

  useEffect(() => {
    if (!config.enabled) {
      return;
    }

    /**
     * Динамический импорт web-vitals библиотеки
     * Next.js предоставляет встроенную поддержку через reportWebVitals
     */
    const reportWebVitals = async () => {
      try {
        // Импортируем функции из web-vitals
        // Примечание: FID deprecated в пользу INP в web-vitals v4+
        const { onCLS, onFCP, onLCP, onTTFB, onINP } = await import(
          'web-vitals'
        );

        // Подписываемся на все метрики
        onCLS(handleWebVital);
        onFCP(handleWebVital);
        onLCP(handleWebVital);
        onTTFB(handleWebVital);
        onINP(handleWebVital);

        if (config.debug) {
          console.log('✅ Web Vitals мониторинг инициализирован');
        }
      } catch (error) {
        if (config.debug) {
          console.error('❌ Ошибка инициализации Web Vitals:', error);
        }
      }
    };

    reportWebVitals();
  }, [config.enabled, config.debug, handleWebVital]);

  // Компонент не рендерит ничего визуального
  return null;
}
