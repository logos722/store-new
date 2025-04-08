'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Container from '@/shared/components/container/Container';
import { Product } from '@/types/product';
import { useCart } from '@/context/cart';
import { mockProduct } from '../../../mocks/products'; 
import styles from './ProductPage.module.scss';
import { useQuery } from '@tanstack/react-query';
// Функция-загрузчик для продукта.
// Используем queryKey, чтобы получить id.
const fetchProduct = async ({ queryKey }: any): Promise<Product> => {
  const [, id] = queryKey;
  // Имитируем задержку API (например, 1 секунда)
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Здесь можно добавить логику запроса к реальному API, используя id
  return mockProduct; // Для примера возвращаем mock-данные, которые соответствуют типу Product
};

const ProductPage = () => {
  const { id } = useParams();
  // const [product, setProduct] = useState<Product | null>(null);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  const { data: product, isLoading, error } = useQuery<Product, Error>({
    queryKey: ['product', id as string],
    queryFn: fetchProduct,
    enabled: Boolean(id) // Загружаем данные только если id существует
  });


  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

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

  return (
    <Container>
      <div className={styles.productPage}>
        <div className={styles.productImage}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={styles.image}
          />
        </div>

        <div className={styles.productInfo}>
          <h1>{product.name}</h1>
          <p className={styles.price}>{product.price.toFixed(2)} ₽</p>
          <p className={styles.description}>{product.description}</p>

          <div className={styles.stock}>
            {product.stock > 0 ? (
              <span className={styles.inStock}>
                В наличии ({product.stock} шт.)
              </span>
            ) : (
              <span className={styles.outOfStock}>Нет в наличии</span>
            )}
          </div>

          <div className={styles.actions}>
            <button
              onClick={handleAddToCart}
              className={styles.addToCartButton}
              disabled={product.stock === 0}
            >
              Добавить в корзину
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ProductPage; 