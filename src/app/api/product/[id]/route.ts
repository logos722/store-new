import { NextResponse } from 'next/server';
import type { ProductDetail } from '../../types';
import { getApiUrl } from '@/shared/utils/getApiUrl';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  const apiUrl = getApiUrl();
  try {
    const res = await fetch(`${apiUrl}/api/product/${encodeURIComponent(id)}`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: `Product ${id} not found` },
        { status: res.status },
      );
    }
    const product: ProductDetail = await res.json();
    return NextResponse.json(product);
  } catch (err) {
    console.error('Product proxy error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
