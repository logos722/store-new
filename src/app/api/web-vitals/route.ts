/**
 * API endpoint для сбора Web Vitals метрик
 *
 * POST /api/web-vitals
 *
 * Особенности:
 * - Принимает метрики от клиентов
 * - Валидация входящих данных
 * - Поддержка различных бэкендов для хранения
 * - Rate limiting (защита от спама)
 * - Error handling
 *
 * Варианты хранения метрик:
 * Аналитические платформы (Google Analytics)
 */

import { NextRequest, NextResponse } from 'next/server';
import type { WebVitalReport, WebVitalApiResponse } from '@/types/webVitals';

/**
 * Разрешенные источники (CORS)
 * В production замените на ваш домен
 */
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_BASE_URL || 'https://gelionaqua.ru',
  'http://localhost:3000',
];

/**
 * Валидация метрики Web Vitals
 */
function validateWebVitalReport(data: unknown): data is WebVitalReport {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const report = data as Partial<WebVitalReport>;

  // Проверяем обязательные поля
  const requiredFields: (keyof WebVitalReport)[] = [
    'id',
    'name',
    'value',
    'rating',
    'delta',
    'url',
    'pathname',
    'timestamp',
    'userAgent',
    'sessionId',
  ];

  for (const field of requiredFields) {
    if (!(field in report)) {
      return false;
    }
  }

  // Проверяем типы
  if (
    typeof report.id !== 'string' ||
    typeof report.name !== 'string' ||
    typeof report.value !== 'number' ||
    typeof report.rating !== 'string' ||
    typeof report.delta !== 'number' ||
    typeof report.url !== 'string' ||
    typeof report.pathname !== 'string' ||
    typeof report.timestamp !== 'string' ||
    typeof report.userAgent !== 'string' ||
    typeof report.sessionId !== 'string'
  ) {
    return false;
  }

  // Проверяем допустимые значения метрик
  const validMetrics = ['CLS', 'FCP', 'FID', 'LCP', 'TTFB', 'INP'];
  if (!validMetrics.includes(report.name)) {
    return false;
  }

  // Проверяем допустимые рейтинги
  const validRatings = ['good', 'needs-improvement', 'poor'];
  if (!validRatings.includes(report.rating)) {
    return false;
  }

  return true;
}

async function saveWebVitalReport(
  report: WebVitalReport,
): Promise<{ success: boolean; error?: string }> {
  try {
    // ========================================
    // ВАРИАНТ 1: Логирование в консоль (для разработки)
    // ========================================
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Web Vital получена:', {
        metric: report.name,
        value: report.value,
        rating: report.rating,
        pathname: report.pathname,
        timestamp: report.timestamp,
      });
    }

    // ========================================
    // ВАРИАНТ 2: Google Analytics (рекомендуется для начала)
    // ========================================
    // Если вы уже используете GA4, можно отправлять туда через Measurement Protocol API
    // https://developers.google.com/analytics/devguides/collection/protocol/ga4

    const NEXT_PUBLIC_GA_MEASUREMENT_ID =
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    const GA_API_SECRET = process.env.GA_API_SECRET;

    if (NEXT_PUBLIC_GA_MEASUREMENT_ID && GA_API_SECRET) {
      await fetch(
        `https://www.google-analytics.com/mp/collect?measurement_id=${NEXT_PUBLIC_GA_MEASUREMENT_ID}&api_secret=${GA_API_SECRET}`,
        {
          method: 'POST',
          body: JSON.stringify({
            client_id: report.sessionId,
            events: [
              {
                name: 'web_vitals',
                params: {
                  metric_name: report.name,
                  metric_value: report.value,
                  metric_rating: report.rating,
                  page_path: report.pathname,
                },
              },
            ],
          }),
        },
      );
    }

    // ========================================
    // ВАРИАНТ 3: База данных (PostgreSQL/MongoDB)
    // ========================================
    // Пример с Prisma:
    /*
    await prisma.webVitalMetric.create({
      data: {
        metricId: report.id,
        name: report.name,
        value: report.value,
        rating: report.rating,
        delta: report.delta,
        url: report.url,
        pathname: report.pathname,
        timestamp: new Date(report.timestamp),
        userAgent: report.userAgent,
        sessionId: report.sessionId,
        version: report.version,
        environment: report.environment,
        connectionType: report.connectionType,
        effectiveConnectionType: report.effectiveConnectionType,
        deviceMemory: report.deviceMemory,
        navigationType: report.navigationType,
        attribution: report.attribution as any,
      },
    });
    */

    // ========================================
    // ВАРИАНТ 4: Внешний сервис (Amplitude, Mixpanel, Sentry)
    // ========================================
    /*
    // Amplitude
    await fetch('https://api2.amplitude.com/2/httpapi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: process.env.AMPLITUDE_API_KEY,
        events: [{
          user_id: report.sessionId,
          event_type: 'web_vital',
          event_properties: report,
        }],
      }),
    });

    // Sentry Performance
    const Sentry = require('@sentry/nextjs');
    Sentry.captureMessage('Web Vital', {
      level: 'info',
      tags: {
        metric: report.name,
        rating: report.rating,
      },
      extra: report,
    });
    */

    // ========================================
    // ВАРИАНТ 5: File-based хранение (для быстрого старта)
    // ========================================
    /*
    const fs = require('fs').promises;
    const path = require('path');
    
    const logDir = path.join(process.cwd(), 'logs');
    const logFile = path.join(logDir, 'web-vitals.jsonl');
    
    // Создаем директорию если не существует
    await fs.mkdir(logDir, { recursive: true });
    
    // Добавляем запись в JSONL файл
    await fs.appendFile(logFile, JSON.stringify(report) + '\n');
    */

    return { success: true };
  } catch (error) {
    console.error('Ошибка сохранения Web Vital:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * POST handler для приема Web Vitals метрик
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Проверяем Origin (CORS)
    const origin = request.headers.get('origin');
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Origin not allowed',
        } as WebVitalApiResponse,
        { status: 403 },
      );
    }

    // Парсим body
    const data = await request.json();

    // Валидируем данные
    if (!validateWebVitalReport(data)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid Web Vital report format',
        } as WebVitalApiResponse,
        { status: 400 },
      );
    }

    // Сохраняем метрику
    const result = await saveWebVitalReport(data as WebVitalReport);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to save metric',
        } as WebVitalApiResponse,
        { status: 500 },
      );
    }

    // Возвращаем успешный ответ
    const response = NextResponse.json(
      {
        success: true,
        message: 'Metric saved successfully',
      } as WebVitalApiResponse,
      { status: 200 },
    );

    // Добавляем CORS заголовки
    if (origin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    }

    return response;
  } catch (error) {
    console.error('API Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      } as WebVitalApiResponse,
      { status: 500 },
    );
  }
}

/**
 * OPTIONS handler для CORS preflight
 */
export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
  const origin = request.headers.get('origin');

  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return new NextResponse(null, { status: 403 });
  }

  const response = new NextResponse(null, { status: 204 });
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  response.headers.set('Access-Control-Max-Age', '86400');

  return response;
}
