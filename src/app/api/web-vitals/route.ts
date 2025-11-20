import { NextRequest, NextResponse } from 'next/server';
import type { WebVitalReport } from '@/types/webVitals';

/**
 * API для сбора Web Vitals метрик
 *
 * POST /api/web-vitals
 *
 * Если у вас нет собственной системы хранения метрик,
 * этот endpoint просто логирует их в консоль.
 *
 * Для production вы можете:
 * 1. Сохранять в базу данных
 * 2. Отправлять в сторонний сервис (Datadog, Sentry, etc.)
 * 3. Отправлять в Google Analytics через Measurement Protocol API
 * 4. Просто отключить (NEXT_PUBLIC_WEB_VITALS_ENABLED=false)
 */
export async function POST(request: NextRequest) {
  try {
    const metric: WebVitalReport = await request.json();

    // Валидация базовых полей
    if (!metric.name || !metric.value) {
      return NextResponse.json(
        { success: false, error: 'Invalid metric data' },
        { status: 400 },
      );
    }

    // В production рекомендуется логировать только в development
    // или отправлять в систему мониторинга
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Web Vitals:', {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        pathname: metric.pathname,
      });
    }

    // TODO: Здесь можно добавить отправку метрик в вашу систему мониторинга
    // Примеры:
    //
    // 1. Сохранение в базу данных:
    // await db.webVitals.create({ data: metric });
    //
    // 2. Отправка в Google Analytics:
    await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}&api_secret=${process.env.GA_API_SECRET}`,
      {
        method: 'POST',
        body: JSON.stringify({
          client_id: metric.sessionId,
          events: [
            {
              name: 'web_vitals',
              params: {
                metric_name: metric.name,
                metric_value: metric.value,
                metric_rating: metric.rating,
              },
            },
          ],
        }),
      },
    );
    //
    // 3. Отправка в Datadog/Sentry/etc.:
    // await monitoringService.trackMetric(metric);

    return NextResponse.json({
      success: true,
      message: 'Metric received',
    });
  } catch (error) {
    console.error('Error processing web vitals:', error);

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}

/**
 * GET endpoint для проверки работоспособности API
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Web Vitals API is running',
    endpoint: '/api/web-vitals',
    method: 'POST',
  });
}
