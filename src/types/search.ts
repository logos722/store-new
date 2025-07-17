import { Product } from './product';

export interface SearchCategory {
  id: string;
  name: string;
  slug: string;
}

export interface SearchResult {
  products: Product[];
  categories: SearchCategory[];
}

export interface SearchResponse {
  products: Product[];
}
