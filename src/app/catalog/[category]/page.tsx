'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Container from '@/shared/components/container/Container';
import ProductCard from '@/shared/components/productCard/ProductCard';
import ProductFilters from '@/shared/components/filters/ProductFilters';
import ProductSorting from '@/shared/components/sorting/ProductSorting';
import styles from './CategoryPage.module.scss';
import { Product } from '@/types/product';
import { useInfiniteQuery } from '@tanstack/react-query';
import {Loading, Alert, BackToTopButton} from '@/shared/components';
import InfiniteScroll from 'react-infinite-scroll-component';
import { QueryFunctionContext } from '@tanstack/react-query';
import { CatalogInfo } from '@/constants/catalogs';

const PAGE_SIZE = 20;
interface CategoryPageResponse {
  products: Product[];
  page:     number;
  totalPages: number;
}

// Правильно типизируем context
const fetchCategoryPage = async (
  context: QueryFunctionContext<['catalog', string], number>
): Promise<CategoryPageResponse> => {
  const page = context.pageParam ?? 1;
  const category = context.queryKey[1];
  const res = await fetch(
    `/api/catalog/${encodeURIComponent(category)}?page=${page}&limit=${PAGE_SIZE}`
  );
  if (!res.ok) throw new Error('Ошибка получения товаров');
  return res.json();
};



type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

const CategoryPage = () => {
  const { category } = useParams();

  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState<SortOption>('name-asc');

  const {
    data: categoryProducts,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
  } = useInfiniteQuery<CategoryPageResponse, Error>({
    queryKey: ['catalog', category as string],
    queryFn:  fetchCategoryPage,
    enabled:  Boolean(category),
    // ← здесь обязательно прокидываем initialPageParam
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages
        ? lastPage.page + 1
        : undefined,
  });

  const getCatalogName = (categorys: string) => {
    const category = CatalogInfo[categorys];

    return category.title
  }

  // все загруженные продукты
  const allProducts: Product[] = useMemo(
    () => categoryProducts?.pages.flatMap(page => page.products) ?? [],
    [categoryProducts]
  );

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...allProducts];

    // Фильтрация по цене
    result = result.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Фильтрация по наличию
    if (inStock) {
      result = result.filter(product => product.stock > 1);
    }

    // Сортировка
    result.sort((a, b) => {
      switch (sort) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    return result;
  }, [allProducts, priceRange, inStock, sort]);

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
            <h1>{getCatalogName(category ?? '')}</h1>
            <ProductSorting currentSort={sort} onSortChange={setSort} />
          </div>

          <InfiniteScroll
            dataLength={allProducts.length}
            next={() => fetchNextPage()}
            hasMore={!!hasNextPage}
            loader={<Loading isLoading={isFetchingNextPage} />}
            endMessage={<p style={{ textAlign: 'center' }}>Больше нет товаров</p>}
          >
            <div className={styles.products}>
              {filteredAndSortedProducts.map(p => (
                <ProductCard key={p.id} product={p} viewType="grid" />
              ))}
            </div>
          </InfiniteScroll>
        </main>
      </div>

      {/* Кнопка «вверх» */}
      <BackToTopButton />
    </Container>
  );
};

export default CategoryPage;