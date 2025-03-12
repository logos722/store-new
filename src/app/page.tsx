import { SliderMain } from '../components';
import cat1 from '../../public/cat1.jpeg';
import cat2 from '../../public/cat2.jpeg';
import cat3 from '../../public/cat3.jpeg';
import { Catalog as CatalogType } from '@/types/catalog';
import Catalog from '@/shared/components/catalog/Catalog';
import Container from '@/shared/components/container/Container';
import { Sidebar } from '@/shared/components';
import styles from './page.module.scss';

const images = [
  { src: cat1, alt: 'Image 1', url: '/test' },
  { src: cat2, alt: 'Image 2', url: '/test' },
  { src: cat3, alt: 'Image 3', url: '/test' },
];

const sampleCatalog: CatalogType = {
  title: 'Popular',
  description: 'Browse our selection of amazing products.',
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
    // Добавьте больше продуктов по необходимости
  ],
};

export default function Home() {
  return (
    <Container>
      <div className={styles.mainLayout}>
        <Sidebar />
        <div className={styles.mainContent}>
          <SliderMain images={images} />
          <Catalog catalog={sampleCatalog} />
        </div>
      </div>
    </Container>
  );
}
