'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Container from '@/shared/components/container/Container';
import ProductCard from '@/shared/components/productCard/ProductCard';
import ProductFilters from '@/shared/components/filters/ProductFilters';
import ProductSorting from '@/shared/components/sorting/ProductSorting';
import styles from './CategoryPage.module.scss';
import { Product } from '@/types/product';
import { useQuery } from '@tanstack/react-query';
import {Loading, Alert} from '@/shared/components';

const fetchCategoryProducts = async ({ queryKey }: { 
  queryKey: readonly unknown[] 
}): Promise<Product[]> => {
  const [, category] = queryKey as readonly [string, string];
  const res = await fetch(`/api/catalog/${category}`);
  if (!res.ok) {
    throw new Error("Ошибка получения товаров категории");
  }
  const data = await res.json();
  // Directly return the products array without additional parsing
  return data.products;
};

type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

const CategoryPage = () => {
  const { category } = useParams();
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState<SortOption>('price-asc');

  const { data: categoryProducts, isLoading, error, refetch } = useQuery<Product[], Error>({
    queryKey: ['catalog', category as string],
    queryFn: fetchCategoryProducts,
    enabled: Boolean(category)
  });

  const productsList = categoryProducts || [];

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...productsList];

    // Фильтрация по цене
    result = result.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Фильтрация по наличию
    if (inStock) {
      result = result.filter(product => product.inStock);
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
  }, [productsList, priceRange, inStock, sort]);

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <Container className='centered'>
          <Loading isLoading={isLoading} />
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
      <Container>
        <Alert message={error.message} onRetry={refetch} type='error'/>
      </Container>
      </div>
    );
  }

  if (!categoryProducts) {
    return (
      <div className={styles.wrapper}>
      <Container>
        <Alert message='Товары не найдены' type='error' />
      </Container>
      </div>
      
    );
  }

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