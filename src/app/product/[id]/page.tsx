import { Metadata } from 'next';
import { Product } from '@/types/product';
import { generateProductMetadata } from '@/shared/utils/seo';
import { generateProductSchema } from '@/shared/utils/structuredDataUtils';
import ServerStructuredData from '@/shared/components/seo/ServerStructuredData';
import ProductPageClient from './ProductPageClient';
import { notFound } from 'next/navigation';

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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  try {
    const res = await fetch(
      `${baseUrl}/api/product/${encodeURIComponent(id)}`,
      {
        // Кэшируем данные продукта на 1 час
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) {
      notFound();
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching product for metadata:', error);
    notFound();
  }
}

/**
 * Генерирует метаданные для страницы продукта на сервере
 * Это обеспечивает правильную индексацию поисковыми системами
 *
 * Примечание: если продукт не найден, getProduct вызовет notFound(),
 * который прервет выполнение и отобразит страницу not-found.tsx
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = params;
  const product = await getProduct(id);

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
      <ProductPageClient product={product as Product} />
    </>
  );
}
