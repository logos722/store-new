import { getApiUrl } from '@/shared/utils/getApiUrl';
import { NextResponse } from 'next/server';

export async function GET() {
  const apiUrl = getApiUrl();

  try {
    const res = await fetch(`${apiUrl}/api/categories`);
    if (!res.ok) {
      return NextResponse.json(
        { error: `Categories not found` },
        { status: res.status },
      );
    }
    const data: { categories: string[] } = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Categories proxy error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
