import React from 'react';
import Image from 'next/image';
import styles from './CartItem.module.scss';
import { CartItem as CartItemType } from '@/store/useCartStore';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItemComponent: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  const { image, name, price, quantity, id, stock } = item;

  return (
    <div className={styles.cartItem}>
      <div className={styles.imageWrapper}>
        <Image
          src={image ?? '/Placeholred_One.webp'}
          alt={name}
          width={80}
          height={80}
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{name}</h3>
        <p className={styles.price}>{price.toFixed(2)} ₽</p>

        <p className={styles.total}>
          {quantity} × {price.toFixed(2)} ₽ = {(quantity * price).toFixed(2)} ₽
        </p>
        <div className={styles.quantity}>
          <button
            onClick={() => onUpdateQuantity(id, quantity - 1)}
            disabled={quantity <= 1}
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            onClick={() => onUpdateQuantity(id, quantity + 1)}
            disabled={quantity >= stock}
          >
            +
          </button>
        </div>
      </div>
      <button className={styles.removeButton} onClick={() => onRemove(id)}>
        ×
      </button>
    </div>
  );
};

export default React.memo(CartItemComponent);
