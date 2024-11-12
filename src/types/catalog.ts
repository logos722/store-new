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
