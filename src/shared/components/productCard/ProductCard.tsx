'use client';

import React from 'react';
import { Product } from '@/types/product';
import styles from './ProductCard.module.scss';
import Image from 'next/image';
import { useCart } from '@/context/cart';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className={styles.productCard}>
      <Image
        src={product.image}
        alt={product.name}
        className={styles.productImage}
      />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>{product.price.toFixed(2)} ₽</p>
      <button onClick={handleAddToCart} className={styles.addToCartButton}>
        Добавить в корзину
      </button>
    </div>
  );
};

export default ProductCard;
