import { Product } from './product';

export interface Catalog {
  title: string;
  description?: string;
  products: Product[];
}

export interface CatalogFilters {
  searchQuery?: string;
  category?: string;
  priceRange?: [number, number];
  sortBy?: 'price' | 'name';
}

export type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

/**
 * Представляет витрину каталога для отображения на главной странице
 */
export interface CatalogShowcase {
  /** Уникальный идентификатор категории */
  categoryId: string;
  /** Название категории */
  title: string;
  /** Описание категории */
  description?: string;
  /** Slug для URL (например, 'pvc', 'fittings') */
  slug: string;
  /** URL изображения категории */
  imageUrl?: string;
  /** Список товаров для витрины (обычно 4 штуки) */
  products: Product[];
  /** Общее количество товаров в категории */
  totalProducts?: number;
}
