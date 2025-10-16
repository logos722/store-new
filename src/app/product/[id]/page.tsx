'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Container from '@/shared/components/container/Container';
import { Product } from '@/types/product';
import styles from './ProductPage.module.scss';
import { useQuery } from '@tanstack/react-query';
import cat1 from '../../../../public/cat1.jpeg';
import { QuantityToggleButton } from '@/shared/components';
import useSEO from '@/shared/hooks/useSEO';
import StructuredData, {
  StructuredDataGenerator,
} from '@/shared/components/seo/StructuredData';
import SEOHead from '@/shared/components/seo/SEOHead';
import Breadcrumbs from '@/shared/components/seo/Breadcrumbs';
import { CatalogInfo } from '@/constants/catalogs';

// Функция-загрузчик для продукта.
const fetchProduct = async ({ queryKey }): Promise<Product> => {
  const [, id] = queryKey;
  const res = await fetch(`/api/product/${encodeURIComponent(id)}`);
  if (!res.ok) {
    throw new Error(`Ошибка при загрузке продукта: ${res.status}`);
  }
  const data: Product = await res.json();
  return data;
};

const ProductPage = () => {
  const { id } = useParams();

  const { productPageSEO } = useSEO();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery<Product, Error>({
    queryKey: ['product', id as string],
    queryFn: fetchProduct,
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <Container>
        <div className={styles.loading}>Загрузка...</div>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container>
        <div className={styles.error}>
          {error instanceof Error ? error.message : 'Продукт не найден'}
        </div>
      </Container>
    );
  }

  const getStock = () => {
    if (product.stock >= 5) {
      return <span className={styles.inStock}>В наличии больше 5 шт.</span>;
    } else if (product.stock < 5) {
      return (
        <span className={styles.inStock}>В наличии ({product.stock} шт.)</span>
      );
    } else {
      return <span className={styles.outOfStock}>Нет в наличии</span>;
    }
  };

  const seoData = productPageSEO(product);
  const productSchema = StructuredDataGenerator.generateProductSchema(product);

  const productGroup = CatalogInfo[product.groupId];

  const breadcrumbItems = [
    { name: 'Главная', href: '/' },
    { name: 'Каталог', href: '/catalog' },
    { name: productGroup.title, href: `/catalog/${productGroup.slug}` },
    {
      name: product.category,
      href: `/catalog/${productGroup.slug}?category=${encodeURIComponent(product.category)}`,
    },
    { name: product.name, href: `/product/${product.id}`, current: true },
  ];

  return (
    <Container>
      <SEOHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        image={seoData.image}
        canonicalUrl={`/product/${product.slug}`}
        structuredData={productSchema}
      />

      <StructuredData data={productSchema} />

      <Breadcrumbs items={breadcrumbItems} />

      <div className={styles.productPage}>
        <div className={styles.productImage}>
          <Image
            src={product.image ?? cat1}
            alt={product.name}
            fill
            className={styles.image}
          />
        </div>

        <div className={styles.productInfo}>
          <h1>{product.name}</h1>
          <p className={styles.price}>{product.price.toFixed(2)} ₽</p>
          <p className={styles.description}>{product.description}</p>

          <div className={styles.stock}>{getStock()}</div>

          <div className={styles.actions}>
            <QuantityToggleButton product={product} />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ProductPage;
