import React from 'react';
import Link from 'next/link';
import Container from '@/shared/components/container/Container';
import styles from './CatalogPage.module.scss';

const categories = [
  {
    id: 'electronics',
    name: 'Электроника',
    slug: 'electronics',
    description: 'Компьютеры, смартфоны и другая электроника',
    image: '/electronics.jpg'
  },
  {
    id: 'clothing',
    name: 'Одежда',
    slug: 'clothing',
    description: 'Мужская и женская одежда',
    image: '/clothing.jpg'
  },
  {
    id: 'books',
    name: 'Книги',
    slug: 'books',
    description: 'Художественная и научная литература',
    image: '/books.jpg'
  },
  {
    id: 'home',
    name: 'Товары для дома',
    slug: 'home',
    description: 'Всё для уюта в вашем доме',
    image: '/home.jpg'
  }
];

const CatalogPage = () => {
  return (
    <Container>
      <div className={styles.catalogPage}>
        <h1>Каталог товаров</h1>
        <div className={styles.categories}>
          {categories.map((category) => (
            <Link
              href={`/catalog/${category.slug}`}
              key={category.id}
              className={styles.categoryCard}
            >
              <div className={styles.categoryImage}>
                {/* Здесь будет изображение категории */}
              </div>
              <h2>{category.name}</h2>
              <p>{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default CatalogPage;
