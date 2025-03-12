'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Container from '@/shared/components/container/Container';
import ProductCard from '@/shared/components/productCard/ProductCard';
import styles from './CategoryPage.module.scss';

// Временные данные для примера
const products = {
  electronics: [
    {
      id: 'e1',
      name: 'Смартфон XYZ',
      description: 'Мощный смартфон с отличной камерой',
      price: 29999,
      image: '/phone.jpg',
      category: 'electronics',
      stock: 10
    },
    // Добавьте больше продуктов...
  ],
  clothing: [
    {
      id: 'c1',
      name: 'Футболка Classic',
      description: 'Классическая футболка из 100% хлопка',
      price: 999,
      image: '/tshirt.jpg',
      category: 'clothing',
      stock: 50
    },
    // Добавьте больше продуктов...
  ],
  // Добавьте другие категории...
};

const CategoryPage = () => {
  const { category } = useParams();
  const categoryProducts = products[category as keyof typeof products] || [];

  return (
    <Container>
      <div className={styles.content}>
        <h1>
          {category === 'electronics' && 'Электроника'}
          {category === 'clothing' && 'Одежда'}
          {category === 'books' && 'Книги'}
          {category === 'home' && 'Товары для дома'}
        </h1>
        <div className={styles.products}>
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {categoryProducts.length === 0 && (
            <p className={styles.noProducts}>
              В данной категории пока нет товаров
            </p>
          )}
        </div>
      </div>
    </Container>
  );
};

export default CategoryPage; 