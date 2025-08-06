'use client';

import React from 'react';
import Image from 'next/image';
import { FaHeart } from 'react-icons/fa';
import { Product } from '@/types/product';
import styles from './ListProductCard.module.scss';
import placeholder from '../../../../public/cat1.jpeg';
import { useRouter } from 'next/navigation';
import QuantityToggleButton from '../quantityToggleButton/QuantityToggleButton';
import { useFavoritesStore } from '@/store/useFavoritesStore';

interface Props {
  product: Product & { quantity?: number };
}

const ListProductCard: React.FC<Props> = ({ product }) => {
  const router = useRouter();
  const toggleFavorite = useFavoritesStore(s => s.toggleFavorite);
  const isFavorite = useFavoritesStore(s => s.isFavorite(product.id));

  return (
    <div
      className={styles.cardList}
      onClick={() => router.push(`/product/${product.id}`)}
      role="button"
      tabIndex={0}
      onKeyPress={e =>
        e.key === 'Enter' && router.push(`/product/${product.id}`)
      }
    >
      <div className={styles.imageWrapList}>
        <Image
          src={product.image ?? placeholder}
          alt={product.name}
          fill
          className={styles.image}
        />
        <button
          className={`${styles.iconButton} ${isFavorite ? styles.active : ''}`}
          onClick={e => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <FaHeart
            key={product.id}
            className={isFavorite ? styles.active : ''}
          />
        </button>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{product.name}</h3>
      </div>

      <div className={styles.listActions}>
        <span className={styles.total}>
          {(product.price * (product.quantity ?? 1)).toFixed(2)} ₽
        </span>
        <QuantityToggleButton product={product} />
      </div>
    </div>
  );
};

export default React.memo(ListProductCard);
