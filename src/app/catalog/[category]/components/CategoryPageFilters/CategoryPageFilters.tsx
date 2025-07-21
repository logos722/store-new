'use client';

import React from 'react';
import styles from './CategoryPageFilters.module.scss';
import ProductFilters from '@/shared/components/filters/ProductFilters';

interface CategoryPageFiltersProps {
  priceRange: { min: number; max: number };
  inStock: boolean;
  selectedCategories: string[];
  onPriceChange: (min: number, max: number) => void;
  onStockChange: (inStock: boolean) => void;
  onCategoryChange: (category: string[]) => void;
}

const CategoryPageFilters: React.FC<CategoryPageFiltersProps> = ({
  priceRange,
  inStock,
  selectedCategories,
  onPriceChange,
  onStockChange,
  onCategoryChange,
}) => {
  return (
    <div>
      <h3 className={styles.heading}>Filters</h3>
      <ProductFilters
        priceRange={priceRange}
        inStock={inStock}
        selectedCategories={selectedCategories}
        onPriceChange={onPriceChange}
        onStockChange={onStockChange}
        onCategoryChange={onCategoryChange}
      />
    </div>
  );
};

export default CategoryPageFilters;
