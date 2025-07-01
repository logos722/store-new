'use client';

import React from 'react';
import { Product } from '@/types/product';
import styles from './ProductCard.module.scss';
import Image from 'next/image';
import { useCart } from '@/context/cart';
import { useRouter } from 'next/navigation';
import cat1 from '../../../../public/cat1.jpeg';



interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Предотвращаем всплытие события
    addToCart(product);
  };

  const handleCardClick = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <div className={styles.productCard} onClick={handleCardClick}>
      <Image
        src={product.image ?? cat1}
        alt={product.name}
        className={styles.productImage}
      />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>{product.price?.toFixed(2)} ₽</p>
      <button onClick={handleAddToCart} className={styles.addToCartButton}>
        Добавить в корзину
      </button>
    </div>
  );
};

export default ProductCard;
