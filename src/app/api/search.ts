import { NextResponse } from 'next/server';
import { SearchResponse, SearchResult } from './types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query')?.toLowerCase() || '';

  // Пример mock-данных. Вместо этого получите данные из базы.
  const allProducts: SearchResult[] = [
    {
      id: 'a69cd2df-774b-11e7-ac50-d017c2d57ada',
      name: 'Американка ПВХ клеевая 110 мм',
      description: 'Разборное соединение для клеевых ПВХ труб',
      price: 80.00,
      image: 'import_files/a6/a69cd2df-774b-11e7-ac50-d017c2d57ada_fa6c88c6-111f-11f0-ae68-d017c2d57ada.jpeg'
    },
    {
      id: '0c81f92e-8d39-11e6-ab2f-d017c2d57ada',
      name: 'Штуцер ПВХ НР 1/2" - 20',
      description: 'Штуцер для соединения ПВХ труб',
      price: 80.00,
      image: '/path/to/another/image.jpeg'
    },
    // и т.д.
  ];

  const results = allProducts.filter(product =>
    product.name.toLowerCase().includes(query) ||
    product.description.toLowerCase().includes(query)
  );

  const response: SearchResponse = {
    query,
    results,
  };

  return NextResponse.json(response);
}