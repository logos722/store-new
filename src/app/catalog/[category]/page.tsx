'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Container from '@/shared/components/container/Container';
import styles from './CategoryPage.module.scss';
import { Loading, Alert, BackToTopButton } from '@/shared/components';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CatalogInfo } from '@/constants/catalogs';
import CategoryPageHeader from './components/CategoryPageHeader/CategoryPageHeader';
import CategoryPageFilters from './components/CategoryPageFilters/CategoryPageFilters';
import { useFilterStore } from '@/store/useFilterStore';
import {
  GridProductCard,
  ListProductCard,
} from '@/shared/components/productCard';
import { useCategoryProducts } from './hooks/useCategoryProducts';
import { CategoryPageSkeleton } from './components/CategoryPageSkeleton/CategoryPageSkeleton';

type QuizParams = {
  category: string[];
};

const CategoryPage = () => {
  const { category: rawCategory } = useParams<QuizParams>();

  // приводим к строке
  const categorySlug =
    typeof rawCategory === 'string'
      ? rawCategory
      : Array.isArray(rawCategory)
        ? rawCategory[0]
        : ''; // или бросать ошибку, если slug обязателен

  if (!categorySlug) {
    <div key="no-categorits" className={styles.wrapper}>
      <Container>
        <Alert message="Категории не найдены" type="error" />
      </Container>
    </div>;
  }
  const debouncedFilters = useFilterStore(s => s.debounced);
  const selectedCategories = useFilterStore(s => s.selectedCategories);
  const priceRangeState = useFilterStore(s => s.priceRange);
  const inStockState = useFilterStore(s => s.inStock);
  const sortState = useFilterStore(s => s.sort);
  const setSelectedCategories = useFilterStore(s => s.setCategories);
  const setPriceRange = useFilterStore(s => s.setPriceRange);
  const setSort = useFilterStore(s => s.setSort);
  const setInStock = useFilterStore(s => s.setInStock);

  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  const {
    data: categoryProducts,
    error,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useCategoryProducts(categorySlug, {
    selectedCategories: debouncedFilters.selectedCategories,
    priceRange: {
      min: debouncedFilters.priceRange.min,
      max: debouncedFilters.priceRange.max,
    },

    inStock: debouncedFilters.inStock,
    sort: debouncedFilters.sort,
  });

  const loadMore = useCallback(() => fetchNextPage(), [fetchNextPage]);

  const getCatalogName = (categorys: string) => {
    const category = CatalogInfo[categorys];

    return category.title;
  };

  const allProducts = useMemo(
    () => categoryProducts?.pages.flatMap(page => page.products) ?? [],
    [categoryProducts],
  );

  console.log('allProducts', allProducts);

  if (error) {
    return (
      <Container>
        <Alert message={error.message} onRetry={refetch} type="error" />
      </Container>
    );
  }
  if (isLoading) {
    return <CategoryPageSkeleton />;
  }
  if (!allProducts.length) {
    return (
      <Container>
        <Alert message="Товары не найдены по заданным фильтрам" type="info" />
      </Container>
    );
  }

  const getProductBlock = () => {
    if (isLoading) {
      return (
        <div className={styles.wrapper}>
          <Container className="centered">
            <Loading isLoading={isLoading} />
          </Container>
        </div>
      );
    } else {
      return (
        <InfiniteScroll
          dataLength={allProducts.length}
          next={() => loadMore()}
          hasMore={!!hasNextPage}
          loader={<Loading key="loading" isLoading={isFetchingNextPage} />}
          endMessage={
            <p key="end-message" className={styles.endMsg}>
              Больше нет товаров
            </p>
          }
        >
          <div
            key="products-grid"
            className={
              viewType === 'grid' ? styles.productsGrid : styles.productsList
            }
          >
            {allProducts.map(p =>
              viewType === 'grid' ? (
                <GridProductCard key={p.id} product={p} />
              ) : (
                <ListProductCard key={p.id} product={p} />
              ),
            )}
          </div>
        </InfiniteScroll>
      );
    }
  };

  if (error) {
    return (
      <div key="error" className={styles.wrapper}>
        <Container>
          <Alert message={error.message} onRetry={refetch} type="error" />
        </Container>
      </div>
    );
  }

  if (!isLoading && !categoryProducts) {
    return (
      <div key="no-products" className={styles.wrapper}>
        <Container>
          <Alert message="Товары не найдены" type="error" />
        </Container>
      </div>
    );
  }

  return (
    <Container>
      <div className={styles.page}>
        {/* 1. Фильтры */}
        <aside className={styles.filters}>
          <CategoryPageFilters
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
            priceRange={priceRangeState}
            inStock={inStockState}
            onPriceChange={setPriceRange}
            onStockChange={setInStock}
          />
        </aside>

        {/* 2. Основной блок */}
        <div className={styles.main}>
          {/* 2.1 Заголовок + контролы */}
          <CategoryPageHeader
            title={getCatalogName(categorySlug)}
            total={categoryProducts?.pages[0].total ?? 0}
            viewType={viewType}
            onViewChange={setViewType}
            sort={sortState}
            onSortChange={setSort}
          />

          {/* 2.2 Список карточек */}
          {getProductBlock()}
        </div>
      </div>

      <BackToTopButton />
    </Container>
  );
};

export default CategoryPage;
