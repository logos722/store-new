import { Metadata } from 'next';
import { Suspense } from 'react';
import { CatalogId, CatalogInfo } from '@/constants/catalogs';
import { generateCategoryMetadata } from '@/shared/utils/seo';
import {
  generateCatalogPageSchema,
  generateBreadcrumbSchema,
} from '@/shared/utils/structuredDataUtils';
import ServerStructuredData from '@/shared/components/seo/ServerStructuredData';
import CategoryPageClient from './CategoryPageClient';
import { Product } from '@/types/product';

/**
 * Серверный компонент страницы категории
 * Генерирует метаданные для SEO и рендерит клиентский компонент
 */

type PageProps = {
  params: { category: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

/**
 * Интерфейс ответа от API каталога
 */
interface CategoryApiResponse {
  category: string;
  products: Product[];
  page: number;
  totalPages: number;
  total: number;
}

/**
 * Получает первую страницу товаров категории с сервера
 * Используется для генерации структурированных данных Schema.org
 *
 * ВАЖНО: Функция вызывается на сервере при SSR/SSG для генерации
 * микроразметки, которая необходима для SEO и Яндекс.Товары
 */
async function getCategoryProducts(
  categorySlug: string,
): Promise<CategoryApiResponse | null> {
  // Используем внутренний API URL для серверных запросов
  // В production это должен быть полный URL приложения
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  try {
    // Загружаем первую страницу товаров с базовыми параметрами
    const params = new URLSearchParams({
      page: '1',
      limit: '20', // Первые 20 товаров для микроразметки Schema.org
      minPrice: '0',
      maxPrice: '1000000',
      inStock: '0', // Показываем все товары (в наличии и под заказ)
      sort: 'default',
    });

    const apiUrl = `${baseUrl}/api/catalog/${categorySlug}?${params}`;

    const res = await fetch(apiUrl, {
      // Кэшируем на 1 час для улучшения производительности
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(
        `[SEO] Error fetching category products: ${res.status} ${res.statusText}`,
        `URL: ${apiUrl}`,
      );
      return null;
    }

    const data = await res.json();

    return data;
  } catch (error) {
    console.error('[SEO] Error fetching category products:', error);
    return null;
  }
}

/**
 * Генерирует метаданные для страницы категории на сервере
 * Это обеспечивает правильную индексацию поисковыми системами
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category: rawCategory } = params;
  const category = CatalogId[rawCategory];

  // Если категория не найдена, возвращаем базовые метаданные
  if (!category) {
    return {
      title: 'Категория не найдена',
      description: 'Запрошенная категория не существует',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const catalogInfo = CatalogInfo[category];

  // Получаем количество товаров для метаданных
  const categoryData = await getCategoryProducts(category);
  const productsCount = categoryData?.total;

  // Генерируем метаданные используя утилиту
  return generateCategoryMetadata(
    catalogInfo.title,
    rawCategory,
    productsCount,
  );
}

/**
 * Генерирует статические параметры для страниц категорий
 * Это позволяет Next.js предрендерить эти страницы во время билда
 */
export async function generateStaticParams() {
  // Возвращаем все доступные категории из констант
  return Object.keys(CatalogInfo).map(categoryKey => ({
    category: CatalogInfo[categoryKey as keyof typeof CatalogInfo].slug,
  }));
}

/**
 * Основной компонент страницы категории
 * Рендерит структурированные данные Schema.org и клиентский компонент
 *
 * ВАЖНО: Структурированные данные генерируются на СЕРВЕРЕ при SSR/SSG.
 * Это необходимо для правильной индексации поисковыми системами и
 * интеграции с Яндекс.Товары. Клиентский компонент не может изменить
 * микроразметку после рендера для целей SEO.
 */
export default async function CategoryPage({ params }: PageProps) {
  const { category: rawCategory } = params;
  const category = CatalogId[rawCategory];
  const { title } = CatalogInfo[category];

  // Загружаем продукты на сервере для структурированных данных
  const categoryData = await getCategoryProducts(category);
  const products = categoryData?.products || [];

  // Предупреждение: если товары не загрузились
  if (!categoryData || products.length === 0) {
    console.warn(
      `[SEO WARNING] No products loaded for category ${rawCategory}. ` +
        `Structured data will be empty. This may affect SEO and Яндекс.Товары integration.`,
    );
  }

  // Генерируем схему каталога с реальными продуктами
  const catalogSchema = generateCatalogPageSchema(
    title,
    products,
    `/catalog/${rawCategory}`,
  );

  // Генерируем хлебные крошки для микроразметки
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Главная', url: '/' },
    { name: 'Каталог', url: '/catalog' },
    { name: title, url: `/catalog/${rawCategory}` },
  ]);

  return (
    <>
      {/* Структурированные данные для SEO */}
      <ServerStructuredData data={catalogSchema} />
      <ServerStructuredData data={breadcrumbSchema} />

      {/* Клиентский компонент с интерактивностью */}
      <Suspense fallback={<div>Загрузка...</div>}>
        <CategoryPageClient />
      </Suspense>
    </>
  );
}
