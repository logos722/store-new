import { Product } from './product';

export interface Catalog {
  title: string;
  description?: string;
  products: Product[];
}
