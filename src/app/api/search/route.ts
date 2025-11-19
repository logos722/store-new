import { NextResponse } from 'next/server';
import type { SearchResponse } from '../types';
import { getApiUrl } from '@/shared/utils/getApiUrl';

/**
 * API route для поиска товаров
 *
 * Кеширование:
 * - Поиск уже использует cache: 'no-store' в fetch
 * - Это правильный подход для динамических данных поиска
 */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query') || '';
  const apiUrl = getApiUrl();

  if (!query.trim()) {
    return NextResponse.json(
      { error: 'Missing or empty query' },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(
      `${apiUrl}/api/search?query=${encodeURIComponent(query)}`,
      { cache: 'no-store' },
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Search failed' },
        { status: res.status },
      );
    }
    const data: SearchResponse = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Search proxy error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
