import { NextResponse } from 'next/server';
import { ProductDetail } from './types';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  // Здесь получите данные из базы/файлов; ниже — пример mock-данных
  const product: ProductDetail = {
    id,
    name: 'Американка ПВХ клеевая 110 мм',
    description: 'Разборное соединение для клеевых ПВХ труб',
    fullName: 'Американка ПВХ клеевая 110 мм',
    price: 80.00,
    stock: 26,
    image: 'import_files/a6/a69cd2df-774b-11e7-ac50-d017c2d57ada_fa6c88c6-111f-11f0-ae68-d017c2d57ada.jpeg',
    characteristics: {
      'Вес': '0',
      'ВидНоменклатуры': 'товар',
      'ТипНоменклатуры': 'Товар'
    }
  };

  return NextResponse.json(product);
}