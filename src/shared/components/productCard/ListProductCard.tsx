'use client';

import React from 'react';
import Image from 'next/image';
import { FaHeart } from 'react-icons/fa';
import { Product } from '@/types/product';
import styles from './ListProductCard.module.scss';
import QuantityToggleButton from '../quantityToggleButton/QuantityToggleButton';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import { LinkTrack } from '../linkTrack/LinkTrack';

interface Props {
  product: Product & { quantity?: number };
  priority?: boolean;
}

const ListProductCard: React.FC<Props> = ({ product, priority = false }) => {
  const toggleFavorite = useFavoritesStore(s => s.toggleFavorite);
  const isFavorite = useFavoritesStore(s => s.isFavorite(product.id));
  const href = `/product/${product.slug || product.id}`;

  return (
    <div className={styles.cardList} role="button" tabIndex={0}>
      <div className={styles.imageWrapList}>
        <Image
          src={product.image ?? '/Placeholred_One.webp'}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          priority={priority}
          className={styles.image}
        />
        <button
          className={`${styles.iconButton} ${isFavorite ? styles.active : ''}`}
          onClick={e => {
            e.stopPropagation();
            toggleFavorite(product);
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
        <LinkTrack prefetch={false} href={href} className={styles.productLink}>
          <h3 className={styles.title}>{product.name}</h3>
        </LinkTrack>
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
