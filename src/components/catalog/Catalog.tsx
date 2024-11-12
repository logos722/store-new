'use client';

import React, { useState } from 'react';
import { Catalog as CatalogType, CatalogFilters } from '@/types/catalog';
import styles from './Catalog.module.scss';
import ProductCard from '@/shared/components/productCard/ProductCard';
import CatalogFiltersComponent from './components/CatalogFiltersComponent';

interface CatalogProps {
  catalog: CatalogType;
}

const Catalog: React.FC<CatalogProps> = ({ catalog }) => {
  const [filters, setFilters] = useState<CatalogFilters>({});

  const handleFilterChange = (newFilters: CatalogFilters) => {
    setFilters(newFilters);
  };

  const filteredProducts = catalog.products
    .filter(product => {
      if (filters.category && product.category !== filters.category)
        return false;
      if (
        filters.searchQuery &&
        !product.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      if (!filters.sortBy) return 0;
      if (filters.sortBy === 'price') return a.price - b.price;
      if (filters.sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className={styles.catalog}>
      <h2>{catalog.title}</h2>
      {catalog.description && <p>{catalog.description}</p>}
      <CatalogFiltersComponent onFilterChange={handleFilterChange} />
      <div className={styles.products}>
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Catalog;
