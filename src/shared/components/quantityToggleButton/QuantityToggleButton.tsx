'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import styles from './QuantityToggleButton.module.scss';
import { useCartStore } from '@/stores/useCartStore';
import { useCartTracking } from '@/hooks/useAnalyticsTracking';

interface QuantityToggleButtonProps {
  product: Product;
}

/**
 * Кнопка управления количеством товара в корзине
 *
 * Аналитика:
 * - Отслеживает добавление товара в корзину
 * - Отслеживает изменение количества товара
 * - Отслеживает удаление товара из корзины
 */
const QuantityToggleButton: React.FC<QuantityToggleButtonProps> = ({
  product,
}) => {
  const updateQuantity = useCartStore(s => s.updateQuantity);
  const addToCart = useCartStore(s => s.addItem);
  const qty = useCartStore(s => s.getQuantity(product.id));

  // Аналитика
  const { trackAddToCart, trackUpdateCartQuantity } = useCartTracking();

  // Решение hydration error: показываем состояние только после монтирования на клиенте
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Обработчик добавления товара в корзину
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    trackAddToCart(product, 1);
  };

  // Обработчик увеличения количества
  const handleIncrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    const oldQty = qty;
    addToCart(product);
    trackUpdateCartQuantity(product, oldQty, oldQty + 1);
  };

  // Обработчик уменьшения количества
  const handleDecrease = (e: React.MouseEvent) => {
    e.stopPropagation();
    const oldQty = qty;
    updateQuantity(product.id, qty - 1);
    trackUpdateCartQuantity(product, oldQty, qty - 1);
  };

  // На сервере всегда показываем кнопку "Добавить"
  if (!isClient) {
    return (
      <div className={styles.wrapper}>
        <button className={styles.addBtn} onClick={handleAddToCart}>
          {'Добавить в корзину'}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <button
        className={`${styles.addBtn} ${qty > 0 ? styles.hidden : ''}`}
        onClick={handleAddToCart}
      >
        {'Добавить в корзину'}
      </button>
      <div className={`${styles.counter} ${qty === 0 ? styles.hidden : ''}`}>
        <button className={styles.minus} onClick={handleDecrease}>
          −
        </button>
        <span className={styles.quantity}>{qty}</span>
        <button className={styles.plus} onClick={handleIncrease}>
          +
        </button>
      </div>
    </div>
  );
};

export default QuantityToggleButton;
