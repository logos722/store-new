'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { FaHeart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { Product } from '@/types/product';
import styles from './GridProductCard.module.scss';
import placeholder from '../../../../public/cat1.jpeg';
import { useRouter } from 'next/navigation';
import QuantityToggleButton from '../quantityToggleButton/QuantityToggleButton';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import Tooltip from '@/shared/components/ui/Tooltip/Tooltip';
import { useTruncationDetection } from '@/shared/hooks/useTruncationDetection';

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

  // Ref для элемента заголовка, используется для определения truncation
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Проверяем, обрезан ли текст заголовка (ellipsis активен)
  // Тултип будет показан только если текст действительно обрезан
  const isTitleTruncated = useTruncationDetection(titleRef, product.name);

  const handleCardClick = () => {
    router.push(`/product/${product.slug}`);
  };

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product);
  };

  /**
   * Генерирует массив иконок звезд для отображения рейтинга
   * Поддерживает полные, половинчатые и пустые звезды
   */
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
        {/* Тултип показывается только если название обрезано (isTitleTruncated = true) */}
        {/* На desktop работает через hover, на mobile через клик */}
        <Tooltip
          content={product.name}
          disabled={!isTitleTruncated} // Показываем только если текст обрезан
          position="top"
          delay={200}
        >
          <h3 ref={titleRef} className={styles.title}>
            {product.name}
          </h3>
        </Tooltip>
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
