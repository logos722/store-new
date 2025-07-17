import { NextResponse } from 'next/server';
import { CatalogResponse, ProductSummary } from './types';

export async function GET(
  request: Request,
  { params }: { params: { category: string } },
) {
  const { category } = params;

  // Здесь вместо mock-данных вы будете получать данные из базы или другого источника
  const products: ProductSummary[] = [
    {
      id: 'a69cd2df-774b-11e7-ac50-d017c2d57ada',
      name: 'Американка ПВХ клеевая 110 мм',
      description: 'Разборное соединение для клеевых ПВХ труб',
      price: 80.0,
      image:
        'import_files/a6/a69cd2df-774b-11e7-ac50-d017c2d57ada_fa6c88c6-111f-11f0-ae68-d017c2d57ada.jpeg',
    },
    // Можно добавить и другие товары
  ];

  const response: CatalogResponse = {
    category,
    products,
  };

  return NextResponse.json(response);
}
