'use client';

import React, { useState } from 'react';
import { CatalogFilters } from '@/types/catalog';
import styles from './CatalogFiltersComponent.module.scss';
import { Input, Select } from '@/shared/components';

interface CatalogFiltersProps {
  onFilterChange: (filters: CatalogFilters) => void;
}

const categoryOptions = [
  { value: '', label: 'All Categories' },
  { value: 'Category 1', label: 'Category 1' },
  { value: 'Category 2', label: 'Category 2' },
  { value: 'Category 3', label: 'Category 3' },
];

const sortOptions = [
  { value: '', label: 'No Sorting' },
  { value: 'price', label: 'Sort by Price' },
  { value: 'name', label: 'Sort by Name' },
];

const CatalogFiltersComponent: React.FC<CatalogFiltersProps> = ({
  onFilterChange,
}) => {
  const [filters, setFilters] = useState<CatalogFilters>({
    searchQuery: '',
    category: '',
    sortBy: 'name',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value);
    const updatedFilters = { ...filters, searchQuery: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleSelectChange = (name: keyof CatalogFilters, value: string) => {
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className={styles.filters}>
      <Input
        placeholder="Search products..."
        type="text"
        value={filters.searchQuery}
        onChange={handleInputChange}
      />
      <Select
        options={categoryOptions}
        value={filters.category || ''}
        onChange={value => handleSelectChange('category', value)}
        placeholder="Select Category"
      />
      <Select
        options={sortOptions}
        value={filters.sortBy || ''}
        onChange={value => handleSelectChange('sortBy', value)}
        placeholder="Sort By"
      />
    </div>
  );
};

export default CatalogFiltersComponent;
