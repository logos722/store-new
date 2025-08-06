'use client';

import React, { useState, useMemo } from 'react';
import { Catalog as CatalogType } from '@/types/catalog';
import styles from './Catalog.module.scss';
import GridProductCard from '../../productCard/GridProductCard';
import ListProductCard from '../../productCard/ListProductCard';
import { ViewButton } from '../..';
interface CatalogProps {
  catalog: CatalogType;
}

const Catalog: React.FC<CatalogProps> = ({ catalog }) => {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const containerClass = useMemo(() => {
    return view === 'grid' ? styles.productsGrid : styles.productsList;
  }, [view]);

  // Handler to toggle view mode
  const handleToggle = (mode: 'grid' | 'list') => {
    setView(mode);
  };

  if (!catalog || !Array.isArray(catalog.products)) {
    return <div className={styles.catalog}>No products available.</div>;
  }

  return (
    <div className={styles.catalog}>
      <h2>{catalog.title}</h2>
      {catalog.description && <p>{catalog.description}</p>}
      <div className={styles.viewContainer}>
        <ViewButton view={view} handleToggle={handleToggle} />
      </div>
      <div className={containerClass}>
        {catalog.products.map(product =>
          view === 'grid' ? (
            <GridProductCard key={product.id} product={product} />
          ) : (
            <ListProductCard key={product.id} product={product} />
          ),
        )}
      </div>
    </div>
  );
};

export default Catalog;
