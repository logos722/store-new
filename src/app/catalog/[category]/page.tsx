import { Metadata } from 'next';
import { Suspense } from 'react';
import { CatalogId, CatalogInfo } from '@/constants/catalogs';
import { generateCategoryMetadata } from '@/shared/utils/seo';
import { generateCatalogPageSchema } from '@/shared/utils/structuredDataUtils';
import ServerStructuredData from '@/shared/components/seo/ServerStructuredData';
import CategoryPageClient from './CategoryPageClient';

/**
 * Серверный компонент страницы категории
 * Генерирует метаданные для SEO и рендерит клиентский компонент
 */

type PageProps = {
  params: { category: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

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

  // Генерируем метаданные используя утилиту
  return generateCategoryMetadata(catalogInfo.title, rawCategory);
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
 * Рендерит структурированные данные и клиентский компонент
 */
export default function CategoryPage({ params }: PageProps) {
  const { category: rawCategory } = params;

  // Генерируем схему для структурированных данных
  // Используем пустой массив продуктов, так как они загружаются динамически на клиенте
  const catalogSchema = generateCatalogPageSchema(
    rawCategory,
    [], // Продукты будут добавлены на клиенте
    `/catalog/${rawCategory}`,
  );

  return (
    <>
      {/* Структурированные данные для SEO */}
      <ServerStructuredData data={catalogSchema} />

      {/* Клиентский компонент с интерактивностью */}
      <Suspense fallback={<div>Загрузка...</div>}>
        <CategoryPageClient />
      </Suspense>
    </>
  );
}
