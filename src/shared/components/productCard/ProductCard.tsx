'use client';

import React from 'react';
import Image from 'next/image';
import {
  FaHeart,
  FaShoppingCart,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
} from 'react-icons/fa';
import { useCart } from '@/context/cart';
import { Product } from '@/types/product';
import styles from './ProductCard.module.scss';
import placeholder from '../../../../public/cat1.jpeg';
import { useRouter } from 'next/navigation';
import QuantityToggleButton from '../quantityToggleButton/QuantityToggleButton';
import { useFavorites } from '@/context/fav/favorites';
import { CiHeart } from 'react-icons/ci';

interface ProductCardProps {
  product: Product & {
    rating?: number; // от 0 до 5
    ratingCount?: number; // сколько оценок
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const { toggleFavorite, isFavorite: checkIsFavorite } = useFavorites();

  const isFavorite = checkIsFavorite(product.id);

  const handleCardClick = () => {
    router.push(`/product/${product.id}`);
  };

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  // Генерация массива звёзд
  const stars = (() => {
    const fullStars = Math.floor(product.rating ?? 0);
    const halfStar = (product.rating ?? 0) - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return [
      ...Array(fullStars).fill(<FaStar key="full" />),
      ...(halfStar ? [<FaStarHalfAlt key="half" />] : []),
      ...Array(emptyStars).fill(<FaRegStar key="empty" />),
    ];
  })();

  return (
    <div className={styles.card} onClick={handleCardClick}>
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
          <FaHeart className={isFavorite ? styles.active : ''} />
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

export default ProductCard;
