import React from 'react';
import Catalog from '../../components/catalog/Catalog';
import { Catalog as CatalogType } from '@/types/catalog';
import cat1 from '../../../public/cat1.jpeg';
import cat2 from '../../../public/cat2.jpeg';
import cat3 from '../../../public/cat3.jpeg';

const sampleCatalog: CatalogType = {
  title: 'Full Catalog',
  description: 'Explore all our amazing products.',
  products: [
    {
      id: '1',
      name: 'Product 1',
      description: 'This is the first product.',
      price: 29.99,
      image: cat1,
      category: 'Category 1',
      stock: 100,
    },
    {
      id: '2',
      name: 'Product 2',
      description: 'This is the second product.',
      price: 49.99,
      image: cat2,
      category: 'Category 2',
      stock: 50,
    },
    {
      id: '3',
      name: 'Product 3',
      description: 'This is the third product.',
      price: 10.11,
      image: cat3,
      category: 'Category 3',
      stock: 50,
    },
  ],
};

const CatalogPage = () => {
  return (
    <div>
      <Catalog catalog={sampleCatalog} />
    </div>
  );
};

export default CatalogPage;
