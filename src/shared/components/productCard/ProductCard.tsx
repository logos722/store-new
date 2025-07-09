'use client';

import React from 'react';
import { Product } from '@/types/product';
import styles from './ProductCard.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import cat1 from '../../../../public/cat1.jpeg';
import {QuantityToggleButton} from '@/shared/components';



interface ProductCardProps {
  product: Product;
  viewType?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewType = 'grid' }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <div className={[
      styles.productCard,
      viewType === 'list' ? styles.list : styles.grid,
    ].join(' ')} onClick={handleCardClick}>
      <div className={styles.imageWrapper}>
          <Image
            src={product.image ?? cat1}
            fill
            alt={product.name}
            className={styles.productImage}
          />
      </div>
      <div className={styles.detailsWrapper}>
        <h3>{product.name}</h3>
        <p className={`${styles.description} ${styles.truncate}`}>{product.description}</p>
        <p className={styles.price}>{product.price.toFixed(2)} ₽</p>
        <QuantityToggleButton product={product} />
      </div>
    </div>
  );
};

export default ProductCard;
