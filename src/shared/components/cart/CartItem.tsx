import React from 'react';
import Image from 'next/image';
import { CartItem as CartItemType } from '@/types/cart';
import styles from './CartItem.module.scss';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const { product, quantity } = item;

  return (
    <div className={styles.cartItem}>
      <div className={styles.imageWrapper}>
        <Image
          src={product.image}
          alt={product.name}
          width={80}
          height={80}
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{product.name}</h3>
        <p className={styles.price}>{product.price} ₽</p>
        <div className={styles.quantity}>
          <button
            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
            disabled={quantity <= 1}
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
            disabled={quantity >= product.stock}
          >
            +
          </button>
        </div>
      </div>
      <button
        className={styles.removeButton}
        onClick={() => onRemove(product.id)}
      >
        ×
      </button>
    </div>
  );
};

export default CartItem;
