'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Container from '@/shared/components/container/Container';
import styles from './CategoryPage.module.scss';
import { Product } from '@/types/product';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loading, Alert, BackToTopButton } from '@/shared/components';
import InfiniteScroll from 'react-infinite-scroll-component';
import { QueryFunctionContext } from '@tanstack/react-query';
import { CatalogInfo, PAGE_SIZE } from '@/constants/catalogs';
import { SortOption } from '@/types/catalog';
import CategoryPageHeader from './components/CategoryPageHeader/CategoryPageHeader';
import CategoryPageFilters from './components/CategoryPageFilters/CategoryPageFilters';
import { InfiniteData } from '@tanstack/react-query';
import { useFilterStore } from '@/store/useFilterStore';
import {
  GridProductCard,
  ListProductCard,
} from '@/shared/components/productCard';
type QuizParams = {
  category: string[];
};

interface CategoryPageResponse {
  category: string; // slug или id категории (по желанию можно не использовать)
  products: Product[]; // товары на текущей странице
  page: number; // номер текущей страницы
  totalPages: number; // всего страниц
  total: number; // общее число товаров по текущему фильтру
}

// Правильно типизируем context
const fetchCategoryPage = async (
  ctx: QueryFunctionContext<
    [
      'catalog',
      string, // category slug
      string[], // selectedCategories
      number,
      number, // priceMin, priceMax
      boolean, // inStock
      SortOption, // sort
    ],
    number // pageParam
  >,
): Promise<CategoryPageResponse> => {
  const [
    ,
    category,
    selectedCategories,
    priceMin,
    priceMax,
    inStock,
    sortOption,
  ] = ctx.queryKey;
  const page = ctx.pageParam ?? 1;

  // Собираем query params
  const params = new URLSearchParams({
    page: String(page),
    limit: String(PAGE_SIZE),
    minPrice: String(priceMin),
    maxPrice: String(priceMax),
    inStock: inStock ? '1' : '0',
    sort: sortOption,
  });

  if (selectedCategories.length > 0) {
    selectedCategories.forEach(cat => params.append('categories', cat));
  }

  const res = await fetch(
    `/api/catalog/${encodeURIComponent(category)}?${params.toString()}`,
  );
  if (!res.ok) {
    throw new Error(`Ошибка получения товаров: ${res.status}`);
  }
  return res.json();
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
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
  } = useInfiniteQuery<
    CategoryPageResponse,
    Error,
    InfiniteData<CategoryPageResponse>,
    [
      'catalog',
      string, // category slug
      string[], // selectedCategories
      number,
      number, // priceMin, priceMax
      boolean, // inStock
      SortOption, // sort
    ],
    number
  >({
    queryKey: [
      'catalog',
      categorySlug,
      debouncedFilters.selectedCategories,
      debouncedFilters.priceRange.min,
      debouncedFilters.priceRange.max,
      debouncedFilters.inStock,
      debouncedFilters.sort,
    ],
    staleTime: 5 * 60_000,
    queryFn: fetchCategoryPage,
    enabled: Boolean(categorySlug),
    initialPageParam: 1,
    getNextPageParam: last =>
      last.page < last.totalPages ? last.page + 1 : undefined,
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
