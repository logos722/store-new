import React from 'react';
import styles from './CategoryPageSkeleton.module.scss';
import { PAGE_SIZE } from '@/constants/catalogs';

export const CategoryPageSkeleton = () => (
  <div className={styles.page}>
    <aside className={styles.filters}>
      {/* Здесь можно повторить skeleton для фильтров */}
      <div className={styles.filterSkeleton} />
      <div className={styles.filterSkeleton} />
    </aside>
    <div className={styles.main}>
      <div className={styles.headerSkeleton}>
        {/* Скeлетон для заголовка и контролов */}
        <div className={styles.titleSkeleton} />
        <div className={styles.controlSkeleton} />
      </div>
      <div className={styles.productsGrid}>
        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <div key={i} className={styles.cardSkeleton} />
        ))}
      </div>
    </div>
  </div>
);
