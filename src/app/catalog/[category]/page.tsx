'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Container from '@/shared/components/container/Container';
import ProductCard from '@/shared/components/productCard/ProductCard';
import ProductFilters from '@/shared/components/filters/ProductFilters';
import ProductSorting from '@/shared/components/sorting/ProductSorting';
import styles from './CategoryPage.module.scss';
import cat1 from '../../../../public/cat1.jpeg';

// Временные данные для примера
const products = {
  electronics: [
    {
      id: 'e1',
      name: 'Смартфон XYZ',
      description: 'Мощный смартфон с отличной камерой',
      price: 29999,
      image: cat1,
      category: 'electronics',
      stock: 10
    },
    {
      id: 'e2',
      name: 'Планшет ABC',
      description: 'Легкий планшет для работы и развлечений',
      price: 19999,
      image: cat1,
      category: 'electronics',
      stock: 5
    },
    {
      id: 'e3',
      name: 'Ноутбук DEF',
      description: 'Производительный ноутбук для работы',
      price: 49999,
      image: cat1,
      category: 'electronics',
      stock: 0
    }
  ],
  clothing: [
    {
      id: 'c1',
      name: 'Футболка Classic',
      description: 'Классическая футболка из 100% хлопка',
      price: 999,
      image: cat1,
      category: 'clothing',
      stock: 50
    },
    {
      id: 'c2',
      name: 'Джинсы Modern',
      description: 'Стильные джинсы прямого кроя',
      price: 2999,
      image: cat1,
      category: 'clothing',
      stock: 30
    }
  ]
};

type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

const CategoryPage = () => {
  const { category } = useParams();
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState<SortOption>('price-asc');

  const categoryProducts = products[category as keyof typeof products] || [];

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...categoryProducts];

    // Фильтрация по цене
    result = result.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Фильтрация по наличию
    if (inStock) {
      result = result.filter(product => product.stock > 0);
    }

    // Сортировка
    result.sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return result;
  }, [categoryProducts, priceRange, inStock, sort]);

  return (
    <Container>
      <div className={styles.categoryPage}>
        <aside className={styles.sidebar}>
          <ProductFilters
            priceRange={priceRange}
            onPriceChange={(min, max) => setPriceRange({ min, max })}
            inStock={inStock}
            onStockChange={setInStock}
          />
        </aside>

        <main className={styles.content}>
          <div className={styles.header}>
            <h1>
              {category === 'electronics' && 'Электроника'}
              {category === 'clothing' && 'Одежда'}
              {category === 'books' && 'Книги'}
              {category === 'home' && 'Товары для дома'}
            </h1>
            <ProductSorting
              currentSort={sort}
              onSortChange={setSort}
            />
          </div>

          <div className={styles.products}>
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {filteredAndSortedProducts.length === 0 && (
              <p className={styles.noProducts}>
                В данной категории пока нет товаров
              </p>
            )}
          </div>
        </main>
      </div>
    </Container>
  );
};

export default CategoryPage; 