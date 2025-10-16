'use client';

import React from 'react';
import styles from './ProductFilters.module.scss';
import { fetchCategories } from '@/shared/api/fetchCategories';
import { useQuery } from '@tanstack/react-query';
import { IS_CATEGORY_MULTISELECT_ENABLED } from '@/constants/featureFlags';

interface ProductFiltersProps {
  priceRange: {
    min: number;
    max: number;
  };
  inStock: boolean;
  selectedCategories: string[];
  onPriceChange: (min: number, max: number) => void;
  onStockChange: (inStock: boolean) => void;
  onCategoryChange: (category: string[]) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  priceRange,
  inStock,
  selectedCategories,
  onPriceChange,
  onStockChange,
  onCategoryChange,
}) => {
  const {
    data: categories = [],
    isLoading,
    isError,
  } = useQuery<string[], Error>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const handleChangeCategory = (product: string, checked?: boolean) => {
    if (IS_CATEGORY_MULTISELECT_ENABLED) {
      if (checked) {
        onCategoryChange([...selectedCategories, product]);
      } else {
        onCategoryChange(selectedCategories.filter(c => c !== product));
      }

      return;
    }

    return checked ? onCategoryChange([product]) : onCategoryChange([]);
  };

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
            onChange={e => {
              console.log('onStockChange(e.target.checked)', e.target.checked);
              onStockChange(e.target.checked);
            }}
          />
          Только в наличии
        </label>
      </div>

      <div className={styles.filterSection}>
        <h4>Категории</h4>
        {isLoading && <p>Загрузка категорий...</p>}
        {isError && <p className={styles.error}>Ошибка при загрузке</p>}
        {!isLoading && !isError && (
          <ul className={styles.categoryList}>
            {categories.map(product => {
              const isSelected = IS_CATEGORY_MULTISELECT_ENABLED
                ? selectedCategories.includes(product)
                : selectedCategories[0] === product;

              return (
                <li key={product} className={styles.categoryItem}>
                  <button
                    type="button"
                    className={`${styles.categoryBtn} ${isSelected ? styles.active : ''}`}
                    aria-pressed={isSelected}
                    onClick={() => handleChangeCategory(product, !isSelected)}
                  >
                    {product}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProductFilters;
