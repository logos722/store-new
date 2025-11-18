import { Metadata } from 'next';
import { Product } from '@/types/product';
import { generateProductMetadata } from '@/shared/utils/seo';
import { generateProductSchema } from '@/shared/utils/structuredDataUtils';
import ServerStructuredData from '@/shared/components/seo/ServerStructuredData';
import ProductPageClient from './ProductPageClient';

/**
 * Серверный компонент страницы продукта
 * Генерирует метаданные для SEO и рендерит клиентский компонент
 */

type PageProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

/**
 * Получает данные продукта с сервера
 * Используется для генерации метаданных
 */
async function getProduct(id: string): Promise<Product | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(
      `${baseUrl}/api/product/${encodeURIComponent(id)}`,
      {
        // Кэшируем данные продукта на 1 час
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching product for metadata:', error);
    return null;
  }
}

/**
 * Генерирует метаданные для страницы продукта на сервере
 * Это обеспечивает правильную индексацию поисковыми системами
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = params;
  const product = await getProduct(id);

  // Если продукт не найден, возвращаем базовые метаданные
  if (!product) {
    return {
      title: 'Продукт не найден',
      description: 'Запрошенный продукт не существует или был удален',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  // Генерируем метаданные используя утилиту
  return generateProductMetadata(product);
}

/**
 * Основной компонент страницы продукта
 * Рендерит структурированные данные и клиентский компонент
 */
export default async function ProductPage({ params }: PageProps) {
  const { id } = params;

  // Пытаемся получить данные продукта для структурированных данных
  // Если не удается, клиентский компонент сам загрузит данные
  const product = await getProduct(id);

  return (
    <>
      {/* Структурированные данные для SEO (если продукт загружен) */}
      {product && (
        <ServerStructuredData data={generateProductSchema(product)} />
      )}

      {/* Клиентский компонент с интерактивностью */}
      <ProductPageClient />
    </>
  );
}
