'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Container from '@/shared/components/container/Container';
import { Product } from '@/types/product';
import styles from './ProductPage.module.scss';
import { QuantityToggleButton } from '@/shared/components';
import Breadcrumbs from '@/shared/components/seo/Breadcrumbs';
import { CatalogInfo } from '@/constants/catalogs';
import { useProductTracking } from '@/hooks/useAnalyticsTracking';

/**
 * Клиентский компонент страницы продукта
 * Получает данные через пропсы от серверного компонента
 *
 * Аналитика:
 * - Отслеживает просмотр товара при загрузке страницы
 */
const ProductPageClient = ({ product }: { product: Product }) => {
  const { trackProductView } = useProductTracking();

  // Отслеживаем просмотр товара при загрузке страницы
  useEffect(() => {
    if (product) {
      trackProductView(product);
    }
  }, [product, trackProductView]);
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
      <Breadcrumbs items={breadcrumbItems} />

      <div className={styles.productPage}>
        <div className={styles.productImage}>
          <Image
            src={product.image ?? '/Placeholred_One.webp'}
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

export default ProductPageClient;
