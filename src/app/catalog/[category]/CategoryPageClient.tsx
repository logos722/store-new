'use client';

import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Container from '@/shared/components/container/Container';
import styles from './CategoryPage.module.scss';
import { Loading, Alert, BackToTopButton } from '@/shared/components';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CatalogId, CatalogInfo } from '@/constants/catalogs';
import CategoryPageHeader from './components/CategoryPageHeader/CategoryPageHeader';
import CategoryPageFilters from './components/CategoryPageFilters/CategoryPageFilters';
import { useFilterStore } from '@/store/useFilterStore';
import {
  GridProductCard,
  ListProductCard,
} from '@/shared/components/productCard';
import { useCategoryProducts } from './hooks/useCategoryProducts';
import { CategoryPageSkeleton } from './components/CategoryPageSkeleton/CategoryPageSkeleton';
import Breadcrumbs from '@/shared/components/seo/Breadcrumbs';

type QuizParams = {
  category: string;
};

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    // isomorphic guard to avoid hydration mismatch
    if (typeof window === 'undefined') return;
    const m = window.matchMedia(query);
    const handler = () => setMatches(m.matches);
    handler();
    m.addEventListener('change', handler);
    return () => m.removeEventListener('change', handler);
  }, [query]);
  return matches;
};

const CategoryPageClient = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isFiltersOpen, setFiltersOpen] = useState(false);
  const { category: rawCategory } = useParams<QuizParams>();
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const listRef = useRef<HTMLDivElement>(null);

  const category = CatalogId[rawCategory];

  // Все hooks должны быть вызваны ДО любых условных возвратов
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

  useEffect(() => {
    if (!isMobile) return;
    const original = document.body.style.overflow;
    if (isFiltersOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = original || '';
    return () => {
      document.body.style.overflow = original || '';
    };
  }, [isFiltersOpen, isMobile]);

  useEffect(() => {
    const prefersReduced = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    (listRef.current ?? window).scrollTo({
      top: 0,
      behavior: prefersReduced ? 'auto' : 'smooth',
    });
  }, [selectedCategories]);

  useEffect(() => {
    if (categoryFromUrl) {
      // Устанавливаем фильтр при загрузке страницы
      setSelectedCategories([categoryFromUrl]);
    }
  }, [categoryFromUrl, setSelectedCategories]);

  const {
    data: categoryProducts,
    error,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useCategoryProducts(category || '', {
    selectedCategories: debouncedFilters.selectedCategories,
    priceRange: {
      min: debouncedFilters.priceRange.min,
      max: debouncedFilters.priceRange.max,
    },

    inStock: debouncedFilters.inStock,
    sort: debouncedFilters.sort,
  });

  const loadMore = useCallback(() => fetchNextPage(), [fetchNextPage]);

  const allProducts = useMemo(
    () => categoryProducts?.pages.flatMap(page => page.products) ?? [],
    [categoryProducts],
  );

  // Проверка категории ПОСЛЕ всех hooks
  if (!category) {
    return (
      <div key="no-categorits" className={styles.wrapper}>
        <Container>
          <Alert message="Категории не найдены" type="error" />
        </Container>
      </div>
    );
  }

  const getCatalogName = (categorys: string) => {
    const category = CatalogInfo[categorys];

    return category.title;
  };

  const breadcrumbItems = [
    { name: 'Главная', href: '/' },
    { name: 'Каталог', href: '/catalog' },
    {
      name: getCatalogName(category),
      href: `/catalog/${category}`,
      current: true,
    },
  ];

  const getProductBlock = () => {
    if (isLoading) {
      return (
        <div className={styles.wrapper}>
          <Container className="centered">
            <CategoryPageSkeleton />
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
            aria-busy={isFetchingNextPage ? 'true' : 'false'}
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
      <Breadcrumbs items={breadcrumbItems} />

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
            title={getCatalogName(category)}
            total={categoryProducts?.pages[0].total ?? 0}
            viewType={viewType}
            onViewChange={setViewType}
            sort={sortState}
            onSortChange={setSort}
          />

          <div className={styles.controlsBar} aria-hidden={!isMobile}>
            <button
              type="button"
              className={styles.filtersBtn}
              onClick={() => setFiltersOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={isFiltersOpen}
              aria-controls="filters-drawer"
            >
              Фильтры
            </button>
          </div>

          {/* 2.2 Список карточек */}
          {getProductBlock()}
        </div>
      </div>

      <BackToTopButton />

      {isMobile && (
        <>
          <div
            id="filters-drawer"
            role="dialog"
            aria-modal="true"
            className={`${styles.filtersDrawer} ${isFiltersOpen ? styles.drawerOpen : ''}`}
          >
            <div className={styles.drawerHeader}>
              <span>Фильтры</span>
              <button
                className={styles.drawerClose}
                onClick={() => setFiltersOpen(false)}
                aria-label="Закрыть фильтры"
              >
                ×
              </button>
            </div>

            <div className={styles.drawerBody}>
              <CategoryPageFilters
                selectedCategories={selectedCategories}
                onCategoryChange={v => {
                  setSelectedCategories(v);
                  // UX: after applying a filter, scroll to top and close the drawer
                  if (typeof window !== 'undefined')
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                priceRange={priceRangeState}
                inStock={inStockState}
                onPriceChange={setPriceRange}
                onStockChange={setInStock}
              />
            </div>

            <div className={styles.drawerFooter}>
              <button
                className={styles.applyBtn}
                onClick={() => setFiltersOpen(false)}
              >
                Применить
              </button>
            </div>
          </div>

          {/* Overlay */}
          <div
            className={`${styles.overlay} ${isFiltersOpen ? styles.overlayVisible : ''}`}
            onClick={() => setFiltersOpen(false)}
          />
        </>
      )}
    </Container>
  );
};

export default CategoryPageClient;
