import { NextResponse } from 'next/server';
import type { CatalogResponse } from '../../types';
import { getApiUrl } from '@/shared/utils/getApiUrl';

export async function GET(
  request: Request,
  { params }: { params: { category: string } },
) {
  const { category } = params;
  const url = new URL(request.url);
  const queryString = url.searchParams.toString();

  const apiUrl = getApiUrl();

  const apiUrlWithParams = `${apiUrl}/api/catalog/${encodeURIComponent(category)}?${queryString}`;

  try {
    // Проксируем запрос, передавая page и limit в query
    const res = await fetch(apiUrlWithParams, { cache: 'no-store' });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Category ${category} not found` },
        { status: res.status },
      );
    }

    const data: CatalogResponse = await res.json();
    // Просто отдаём дальше, включая в data поля page, totalPages и т. д.
    return NextResponse.json(data);
  } catch (err) {
    console.error('Catalog proxy error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
