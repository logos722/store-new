'use client';

import React from 'react';
import Link from 'next/link';
import { CatalogShowcase as CatalogShowcaseType } from '@/types/catalog';
import GridProductCard from '../productCard/GridProductCard';
import styles from './CatalogShowcase.module.scss';

interface CatalogShowcaseProps {
  /** Данные витрины каталога */
  showcase: CatalogShowcaseType;
  /** Показывать ли кнопку "Смотреть все" */
  showViewAllButton?: boolean;
}

/**
 * Компонент витрины каталога для главной страницы
 * Отображает заголовок, описание и фиксированное количество товаров (обычно 4)
 * с возможностью перехода к полному каталогу
 */
const CatalogShowcase: React.FC<CatalogShowcaseProps> = ({
  showcase,
  showViewAllButton = true,
}) => {
  const { title, description, slug, products, totalProducts } = showcase;

  // Проверка наличия товаров
  if (!products || products.length === 0) {
    return (
      <section className={styles.showcase}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        <div className={styles.emptyState}>
          <p>В данной категории пока нет товаров</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.showcase}>
      {/* Заголовок секции */}
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <h2 className={styles.title}>{title}</h2>
          {totalProducts && totalProducts > products.length && (
            <span className={styles.count}>({totalProducts} товаров)</span>
          )}
        </div>
        {description && <p className={styles.description}>{description}</p>}
      </div>

      {/* Сетка товаров */}
      <div className={styles.productsGrid}>
        {products.map(product => (
          <GridProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Кнопка "Смотреть все" */}
      {showViewAllButton && (
        <div className={styles.footer}>
          <Link href={`/catalog/${slug}`} className={styles.viewAllButton}>
            <span>Смотреть все товары</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M7.5 15L12.5 10L7.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      )}
    </section>
  );
};

export default CatalogShowcase;
