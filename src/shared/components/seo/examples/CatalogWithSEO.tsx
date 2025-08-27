'use client';

import React from 'react';
import SEOHead from '../SEOHead';
import Breadcrumbs from '../Breadcrumbs';
import StructuredData, { StructuredDataGenerator } from '../StructuredData';
import useSEO from '@/shared/hooks/useSEO';

/**
 * Пример использования SEOHead в компоненте каталога
 * Показывает, как правильно интегрировать SEO компоненты
 */

interface CatalogWithSEOProps {
  categoryName: string;
  categoryId: string;
  products: any[];
  productsCount: number;
}

const CatalogWithSEO: React.FC<CatalogWithSEOProps> = ({
  categoryName,
  categoryId,
  products,
  productsCount,
}) => {
  // Используем SEO хук для получения данных
  const { categoryPageSEO } = useSEO();
  const seoData = categoryPageSEO(categoryName, productsCount);

  // Генерируем структурированные данные для каталога
  const catalogSchema = StructuredDataGenerator.generateCatalogPageSchema(
    categoryName,
    products,
    `/catalog/${categoryId}`,
  );

  return (
    <>
      {/* SEO метаданные с использованием SEOHead */}
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        image={seoData.image}
        canonicalUrl={`/catalog/${categoryId}`}
        structuredData={catalogSchema}
        type="website"
      />

      {/* Структурированные данные */}
      <StructuredData data={catalogSchema} />

      {/* Хлебные крошки для навигации */}
      <Breadcrumbs />

      {/* Основной контент страницы каталога */}
      <div>
        <h1>{categoryName}</h1>
        <p>Найдено товаров: {productsCount}</p>

        {/* Здесь бы был список товаров */}
        <div>
          {products.map(product => (
            <div key={product.id}>
              {product.name} - {product.price} ₽
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CatalogWithSEO;
