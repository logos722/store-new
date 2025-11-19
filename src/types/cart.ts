import { Product } from './product';

/**
 * Элемент корзины - продукт с добавленным полем quantity
 */
export interface CartItem extends Product {
  quantity: number;
}

/**
 * Состояние корзины
 */
export interface CartState {
  items: CartItem[];
  total: number;
}
