'use client';

import React from 'react';
import styles from './ProductSorting.module.scss';
import { SortOption } from '@/types/catalog';

interface ProductSortingProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const ProductSorting: React.FC<ProductSortingProps> = ({
  currentSort,
  onSortChange,
}) => {
  return (
    <div className={styles.sorting}>
      <label htmlFor="sort">Сортировка:</label>
      <select
        id="sort"
        value={currentSort}
        onChange={e => onSortChange(e.target.value as SortOption)}
      >
        <option value="price-asc">По цене (возрастание)</option>
        <option value="price-desc">По цене (убывание)</option>
        <option value="name-asc">По названию (А-Я)</option>
        <option value="name-desc">По названию (Я-А)</option>
      </select>
    </div>
  );
};

export default ProductSorting;
