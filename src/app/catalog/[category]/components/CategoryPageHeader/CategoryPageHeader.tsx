'use client';

import React from 'react';
import styles from './CategoryPageHeader.module.scss';
import ProductSorting from '@/shared/components/sorting/ProductSorting';
import { SortOption } from '@/types/catalog';
import { ViewButton } from '@/shared/components';

interface CategoryPageHeaderProps {
  title: string;
  total: number;
  viewType: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const CategoryPageHeaderComponent: React.FC<CategoryPageHeaderProps> = ({
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
          Найдено <span className={styles.count}>{total}</span> товаров для{' '}
          <span className={styles.category}>{title}</span>
        </h2>
      </div>

      <div className={styles.controls}>
        <ProductSorting currentSort={sort} onSortChange={onSortChange} />
        <ViewButton view={viewType} handleToggle={onViewChange} />
      </div>
    </div>
  );
};

const CategoryPageHeader = React.memo(CategoryPageHeaderComponent);

export default CategoryPageHeader;
