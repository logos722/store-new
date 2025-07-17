// src/shared/components/CategoryPageFilters/CategoryPageFilters.tsx
'use client';

import React from 'react';
import styles from './CategoryPageFilters.module.scss';
import ProductFilters from '@/shared/components/filters/ProductFilters';

interface CategoryPageFiltersProps {
  priceRange: { min: number; max: number };
  inStock: boolean;
  onPriceChange: (min: number, max: number) => void;
  onStockChange: (inStock: boolean) => void;
}

const CategoryPageFilters: React.FC<CategoryPageFiltersProps> = ({
  priceRange,
  inStock,
  onPriceChange,
  onStockChange,
}) => {
  return (
    <div className={styles.filters}>
      <h3 className={styles.heading}>Filters</h3>
      <ProductFilters
        priceRange={priceRange}
        inStock={inStock}
        onPriceChange={onPriceChange}
        onStockChange={onStockChange}
      />
    </div>
  );
};

export default CategoryPageFilters;
