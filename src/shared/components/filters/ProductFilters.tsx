'use client';

import React from 'react';
import styles from './ProductFilters.module.scss';

interface ProductFiltersProps {
  priceRange: {
    min: number;
    max: number;
  };
  onPriceChange: (min: number, max: number) => void;
  inStock: boolean;
  onStockChange: (inStock: boolean) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  priceRange,
  onPriceChange,
  inStock,
  onStockChange,
}) => {
  return (
    <div className={styles.filters}>
      <h3>Фильтры</h3>

      <div className={styles.filterSection}>
        <h4>Цена</h4>
        <div className={styles.priceInputs}>
          <div className={styles.inputGroup}>
            <label htmlFor="minPrice">От</label>
            <input
              type="number"
              id="minPrice"
              value={priceRange.min}
              onChange={e =>
                onPriceChange(Number(e.target.value), priceRange.max)
              }
              min="0"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="maxPrice">До</label>
            <input
              type="number"
              id="maxPrice"
              value={priceRange.max}
              onChange={e =>
                onPriceChange(priceRange.min, Number(e.target.value))
              }
              min="0"
            />
          </div>
        </div>
      </div>

      <div className={styles.filterSection}>
        <h4>Наличие</h4>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={inStock}
            onChange={e => onStockChange(e.target.checked)}
          />
          Только в наличии
        </label>
      </div>
    </div>
  );
};

export default ProductFilters;
