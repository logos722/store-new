'use client';

import React from 'react';
import styles from './CategoryPageHeader.module.scss';
import ProductSorting from '@/shared/components/sorting/ProductSorting';
import { FaTh, FaThList } from 'react-icons/fa';
import { SortOption } from '@/types/catalog';

interface CategoryPageHeaderProps {
  title: string;
  total: number;
  viewType: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const CategoryPageHeader: React.FC<CategoryPageHeaderProps> = ({
  title,
  total,
  viewType,
  onViewChange,
  sort,
  onSortChange,
}) => {
  return (
    <div className={styles.header}>
      <div className={styles.titleBlock}>
        <h2 className={styles.title}>
          Found <span className={styles.count}>{total}</span> results for{' '}
          <span className={styles.category}>{title}</span>
        </h2>
      </div>

      <div className={styles.controls}>
        <ProductSorting currentSort={sort} onSortChange={onSortChange} />

        <div className={styles.viewToggle}>
          <button
            className={viewType === 'grid' ? styles.active : ''}
            onClick={() => onViewChange('grid')}
            aria-label="Grid view"
          >
            <FaTh />
          </button>
          <button
            className={viewType === 'list' ? styles.active : ''}
            onClick={() => onViewChange('list')}
            aria-label="List view"
          >
            <FaThList />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryPageHeader;
