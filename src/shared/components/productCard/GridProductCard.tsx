'use client';

import React from 'react';
import Image from 'next/image';
import { FaHeart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { Product } from '@/types/product';
import styles from './GridProductCard.module.scss';
import placeholder from '../../../../public/cat1.jpeg';
import { useRouter } from 'next/navigation';
import QuantityToggleButton from '../quantityToggleButton/QuantityToggleButton';
import { useFavoritesStore } from '@/store/useFavoritesStore';

interface ProductCardProps {
  product: Product & {
    rating?: number; // от 0 до 5
    ratingCount?: number; // сколько оценок
  };
}

const GridProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const toggleFavorite = useFavoritesStore(s => s.toggleFavorite);
  const isFavorite = useFavoritesStore(s => s.isFavorite(product.id));

  const handleCardClick = () => {
    router.push(`/product/${product.id}`);
  };

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product);
  };

  const stars = (() => {
    const rating = product.rating ?? 0;
    const fullStars = Math.floor(rating);
    const halfStars = rating - fullStars >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStars;
    const result: React.ReactNode[] = [];
    for (let i = 0; i < fullStars; i++) {
      result.push(<FaStar key={`star-full-${i}`} />);
    }
    if (halfStars) {
      result.push(<FaStarHalfAlt key="star-half" />);
    }
    for (let i = 0; i < emptyStars; i++) {
      result.push(<FaRegStar key={`star-empty-${i}`} />);
    }
    return result;
  })();

  return (
    <div key={product.id} className={styles.card} onClick={handleCardClick}>
      <div className={styles.imageWrap}>
        <Image
          src={product.image ?? placeholder}
          alt={product.name}
          fill
          className={styles.image}
        />
        <button
          className={`${styles.iconButton} ${styles.fav}`}
          onClick={handleFav}
          aria-label={
            isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'
          }
        >
          <FaHeart
            key={product.id}
            className={isFavorite ? styles.active : ''}
          />
        </button>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{product.name}</h3>
        <div className={styles.meta}>
          <span className={styles.price}>{product.price.toFixed(2)} ₽</span>
          <div className={styles.rating}>
            {stars}{' '}
            <span className={styles.count}>({product.ratingCount ?? 0})</span>
          </div>
        </div>
      </div>
      <div className={styles.buttonWraper}>
        <QuantityToggleButton product={product} />
      </div>
    </div>
  );
};

export default GridProductCard;
