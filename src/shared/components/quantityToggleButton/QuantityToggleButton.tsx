'use client';

import React from 'react';
import { Product } from '@/types/product';
import styles from './QuantityToggleButton.module.scss';
import { useCartStore } from '@/store/useCartStore';

interface QuantityToggleButtonProps {
  product: Product;
}

const QuantityToggleButton: React.FC<QuantityToggleButtonProps> = ({
  product,
}) => {
  const updateQuantity = useCartStore(s => s.updateQuantity);
  const addToCart = useCartStore(s => s.addItem);
  const qty = useCartStore(s => s.getQuantity(product.id));

  return (
    <div className={styles.wrapper}>
      <button
        className={`${styles.addBtn} ${qty > 0 ? styles.hidden : ''}`}
        onClick={e => {
          e.stopPropagation();
          addToCart(product);
        }}
      >
        {'Добавить в корзину'}
      </button>
      <div className={`${styles.counter} ${qty === 0 ? styles.hidden : ''}`}>
        {' '}
        <div className={styles.counter}>
          {' '}
          <button
            className={styles.minus}
            onClick={e => {
              e.stopPropagation();
              updateQuantity(product.id, qty - 1);
            }}
          >
            −
          </button>
          <span className={styles.quantity}>{qty}</span>
          <button
            className={styles.plus}
            onClick={e => {
              e.stopPropagation();
              addToCart(product);
            }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuantityToggleButton;
