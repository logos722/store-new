import { NextResponse } from 'next/server';
import { ImageResponse } from './types';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const imagePath = url.searchParams.get('path');

  if (!imagePath) {
    return NextResponse.json(
      { error: 'Параметр path отсутствует' },
      { status: 400 },
    );
  }

  // Если файлы изображений находятся, например, в каталоге public/images
  const imageUrl = `/images/${imagePath}`;

  const response: ImageResponse = { imageUrl };

  return NextResponse.json(response);
}
