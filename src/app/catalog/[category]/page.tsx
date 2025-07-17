'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Container from '@/shared/components/container/Container';
import ProductCard from '@/shared/components/productCard/ProductCard';
import styles from './CategoryPage.module.scss';
import { Product } from '@/types/product';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loading, Alert, BackToTopButton } from '@/shared/components';
import InfiniteScroll from 'react-infinite-scroll-component';
import { QueryFunctionContext } from '@tanstack/react-query';
import { CatalogInfo } from '@/constants/catalogs';
import { SortOption } from '@/types/catalog';
import CategoryPageHeader from './components/CategoryPageHeader/CategoryPageHeader';
import CategoryPageFilters from './components/CategoryPageFilters/CategoryPageFilters';
const PAGE_SIZE = 20;
interface CategoryPageResponse {
  products: Product[];
  page: number;
  totalPages: number;
}

// Правильно типизируем context
const fetchCategoryPage = async (
  context: QueryFunctionContext<['catalog', string], number>,
): Promise<CategoryPageResponse> => {
  const page = context.pageParam ?? 1;
  const category = context.queryKey[1];
  const res = await fetch(
    `/api/catalog/${encodeURIComponent(category)}?page=${page}&limit=${PAGE_SIZE}`,
  );
  if (!res.ok) throw new Error('Ошибка получения товаров');
  return res.json();
};

const CategoryPage = () => {
  const { category } = useParams();

  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState<SortOption>('name-asc');
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  const {
    data: categoryProducts,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetchingNextPage,
  } = useInfiniteQuery<CategoryPageResponse, Error>({
    queryKey: ['catalog', category as string],
    queryFn: fetchCategoryPage,
    enabled: Boolean(category),
    // ← здесь обязательно прокидываем initialPageParam
    initialPageParam: 1,
    getNextPageParam: lastPage =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  const getCatalogName = (categorys: string) => {
    const category = CatalogInfo[categorys];

    return category.title;
  };

  // все загруженные продукты
  const allProducts: Product[] = useMemo(
    () => categoryProducts?.pages.flatMap(page => page.products) ?? [],
    [categoryProducts],
  );

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...allProducts];

    // Фильтрация по цене
    result = result.filter(
      product =>
        product.price >= priceRange.min && product.price <= priceRange.max,
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
        <Container className="centered">
          <Loading isLoading={isLoading} />
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <Container>
          <Alert message={error.message} onRetry={refetch} type="error" />
        </Container>
      </div>
    );
  }

  if (!categoryProducts) {
    return (
      <div className={styles.wrapper}>
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
            priceRange={priceRange}
            inStock={inStock}
            onPriceChange={(min, max) => setPriceRange({ min, max })}
            onStockChange={setInStock}
          />
        </aside>

        {/* 2. Основной блок */}
        <div className={styles.main}>
          {/* 2.1 Заголовок + контролы */}
          <CategoryPageHeader
            title={getCatalogName(
              Array.isArray(category) ? category[0] : category,
            )}
            total={allProducts.length}
            viewType={viewType}
            onViewChange={setViewType}
            sort={sort}
            onSortChange={setSort}
          />

          {/* 2.2 Список карточек */}
          <InfiniteScroll
            dataLength={filteredAndSortedProducts.length}
            next={() => fetchNextPage()}
            hasMore={!!hasNextPage}
            loader={<Loading isLoading={isFetchingNextPage} />}
            endMessage={<p className={styles.endMsg}>Больше нет товаров</p>}
          >
            <div
            // className={
            //   viewType === 'grid' ? styles.productsGrid : styles.productsList
            // }
            >
              {filteredAndSortedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </InfiniteScroll>
        </div>
      </div>

      <BackToTopButton />
    </Container>
  );
};

export default CategoryPage;
