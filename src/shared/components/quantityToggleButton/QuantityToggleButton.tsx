'use client';

import React from 'react';
import { Product } from '@/types/product';
import { useCart } from '@/context/cart';
import styles from './QuantityToggleButton.module.scss';

interface QuantityToggleButtonProps {
  product: Product;
}

const QuantityToggleButton: React.FC<QuantityToggleButtonProps> = ({ product }) => {
  const { getQuantity, addToCart, updateQuantity } = useCart();
  const qty = getQuantity(product.id);

  // Если товара в корзине нет — просто кнопка «Добавить»
  if (qty === 0) {
    return (
      <button
        className={styles.addBtn}
        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
      >
        Добавить в корзину
      </button>
    );
  }

  return (
    <div className={styles.counter}>
      <button
        className={styles.minus}
        onClick={(e) => { e.stopPropagation(); updateQuantity(product.id, qty - 1); }}
      >
        −
      </button>
      <span className={styles.quantity}>{qty}</span>
      <button
        className={styles.plus}
        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
      >
        +
      </button>
    </div>
  );
};

export default QuantityToggleButton;
