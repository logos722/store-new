import React from 'react';
import { Catalog as CatalogType } from '@/types/catalog';
import ProductCard from '../../productCard/ProductCard';
import styles from './Catalog.module.scss';

interface CatalogProps {
  catalog: CatalogType;
}

const Catalog: React.FC<CatalogProps> = ({ catalog }) => {
  return (
    <div className={styles.catalog}>
      <h2>{catalog.title}</h2>
      {catalog.description && <p>{catalog.description}</p>}
      <div className={styles.products}>
        {catalog.products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Catalog;
