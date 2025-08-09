'use client';
import { useInfiniteQuery, QueryFunctionContext } from '@tanstack/react-query';
import { PAGE_SIZE } from '@/constants/catalogs';
import { SortOption } from '@/types/catalog';
import { Product } from '@/types/product';
import { InfiniteData } from '@tanstack/react-query';

interface CategoryPageResponse {
  category: string; // slug или id категории (по желанию можно не использовать)
  products: Product[]; // товары на текущей странице
  page: number; // номер текущей страницы
  totalPages: number; // всего страниц
  total: number; // общее число товаров по текущему фильтру
}

const fetchCategoryPage = async (
  ctx: QueryFunctionContext<
    ['catalog', string, string[], number, number, boolean, SortOption],
    number
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
  const params = new URLSearchParams({
    page: String(page),
    limit: String(PAGE_SIZE),
    minPrice: String(priceMin),
    maxPrice: String(priceMax),
    inStock: inStock ? '1' : '0',
    sort: sortOption,
  });
  selectedCategories.forEach(cat => params.append('categories', cat));

  const res = await fetch(
    `/api/catalog/${encodeURIComponent(category)}?${params}`,
  );
  if (!res.ok) {
    throw new Error(`Ошибка получения товаров: ${res.status}`);
  }
  return res.json();
};

export function useCategoryProducts(
  categorySlug: string,
  filters: {
    selectedCategories: string[];
    priceRange: { min: number; max: number };
    inStock: boolean;
    sort: SortOption;
  },
) {
  return useInfiniteQuery<
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
      filters.selectedCategories,
      filters.priceRange.min,
      filters.priceRange.max,
      filters.inStock,
      filters.sort,
    ],
    staleTime: 5 * 60_000,
    queryFn: fetchCategoryPage,
    enabled: Boolean(categorySlug),
    initialPageParam: 1,
    getNextPageParam: last =>
      last.page < last.totalPages ? last.page + 1 : undefined,
  });
}
