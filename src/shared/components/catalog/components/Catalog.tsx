'use client';

import React from 'react';
import { Catalog as CatalogType } from '@/types/catalog';
import ProductCard from '../../productCard/ProductCard';
import styles from './Catalog.module.scss';

interface CatalogProps {
  catalog: CatalogType;
}

const Catalog: React.FC<CatalogProps> = ({ catalog }) => {
  // const [view, setView] = useState<'grid' | 'list'>('grid');

  return (
    <div className={styles.catalog}>
      <h2>{catalog.title}</h2>
      {catalog.description && <p>{catalog.description}</p>}
      {/* <div className={styles.viewToggle}>
        <button onClick={() => setView('grid')}>🔲</button>
        <button onClick={() => setView('list')}>📃</button>
      </div> */}
      <div
      // className={view === 'grid' ? styles.productsGrid : styles.productsList}
      >
        {catalog.products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Catalog;
