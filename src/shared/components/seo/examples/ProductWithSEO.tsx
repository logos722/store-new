'use client';

import React from 'react';
import SEOHead from '../SEOHead';
import Breadcrumbs from '../Breadcrumbs';
import StructuredData, { StructuredDataGenerator } from '../StructuredData';
import useSEO from '@/shared/hooks/useSEO';
import { Product } from '@/types/product';

/**
 * Пример использования SEOHead в компоненте страницы товара
 * Демонстрирует полную SEO оптимизацию для страницы товара
 */

interface ProductWithSEOProps {
  product: Product & {
    rating?: number;
    ratingCount?: number;
  };
}

const ProductWithSEO: React.FC<ProductWithSEOProps> = ({ product }) => {
  // Используем SEO хук для получения данных
  const { productPageSEO } = useSEO();
  const seoData = productPageSEO(product);

  // Генерируем структурированные данные для товара
  const productSchema = StructuredDataGenerator.generateProductSchema(product);

  // Генерируем хлебные крошки для товара
  const breadcrumbItems = [
    { name: 'Главная', href: '/' },
    { name: 'Каталог', href: '/catalog' },
    { name: product.category, href: `/catalog/${product.category}` },
    { name: product.name, href: `/product/${product.id}`, current: true },
  ];

  return (
    <>
      {/* SEO метаданные для товара */}
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        image={seoData.image}
        canonicalUrl={`/product/${product.id}`}
        structuredData={productSchema}
        type="website"
      />

      {/* Структурированные данные */}
      <StructuredData data={productSchema} />

      {/* Хлебные крошки */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Основной контент страницы товара */}
      <div>
        <h1>{product.name}</h1>

        <div>
          <img
            src={
              typeof product.image === 'string'
                ? product.image
                : product.image.src
            }
            alt={product.name}
            width={400}
            height={300}
          />
        </div>

        <div>
          <p>
            <strong>Цена:</strong> {product.price} ₽
          </p>
          <p>
            <strong>Описание:</strong> {product.description}
          </p>
          <p>
            <strong>Категория:</strong> {product.category}
          </p>
          <p>
            <strong>В наличии:</strong> {product.stock > 0 ? 'Да' : 'Нет'}
          </p>

          {product.rating && (
            <p>
              <strong>Рейтинг:</strong> {product.rating}/5 (
              {product.ratingCount} отзывов)
            </p>
          )}
        </div>

        <div>
          <button>Добавить в корзину</button>
          <button>Добавить в избранное</button>
        </div>
      </div>
    </>
  );
};

export default ProductWithSEO;
