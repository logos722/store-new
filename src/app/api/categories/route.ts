import { getApiUrl } from '@/shared/utils/getApiUrl';
import { NextResponse } from 'next/server';

/**
 * API route для получения категорий товаров
 *
 * Кеширование:
 * - API routes по умолчанию динамические (не генерируются во время билда)
 * - Next.js автоматически кеширует fetch запросы (Data Cache)
 * - Можно настроить через next: { revalidate } в fetch
 */

export async function GET() {
  const apiUrl = getApiUrl();

  // Создаем AbortController для таймаута
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 секунд

  try {
    const res = await fetch(`${apiUrl}/api/categories`, {
      // Добавляем таймаут для предотвращения зависания
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return NextResponse.json(
        { error: `Categories not found` },
        { status: res.status },
      );
    }

    const data: { categories: string[] } = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    // Очищаем таймер в случае ошибки
    clearTimeout(timeoutId);

    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    const isTimeout = errorMessage.includes('aborted');

    console.error(
      `[Categories API] Proxy error: ${errorMessage}${isTimeout ? ' (timeout)' : ''}`,
    );

    // Возвращаем пустой массив категорий вместо ошибки
    // Это позволит приложению работать, даже если внешний API недоступен
    return NextResponse.json(
      { categories: [] },
      { status: 200 }, // Возвращаем 200, а не 500
    );
  }
}
