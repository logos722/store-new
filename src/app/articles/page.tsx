import React from 'react';
import ArticleList from '@/shared/components/articles/ArticleList';
import Container from '@/shared/components/container/Container';
import cat1 from '../../../public/cat1.jpeg';
import cat2 from '../../../public/cat2.jpeg';
import cat3 from '../../../public/cat3.jpeg';
import styles from './page.module.scss';
const sampleArticles = [
  {
    id: '1',
    title: 'Как выбрать идеальный продукт',
    previewImage: cat1.src,
    slug: 'how-to-choose-perfect-product',
  },
  {
    id: '2',
    title: 'Топ-10 трендов этого сезона',
    previewImage: cat2.src,
    slug: 'top-10-trends-this-season',
  },
  {
    id: '3',
    title: 'Советы по уходу за продуктами',
    previewImage: cat3.src,
    slug: 'product-care-tips',
  },
  {
    id: '4',
    title: 'Советы по уходу за продуктами',
    previewImage: cat3.src,
    slug: 'product-care-tips',
  },
];

const ArticlesPage = () => {
  return (
    <Container>
      <div className={styles.articleDiv}>
        <h1>Статьи</h1>
        <ArticleList articles={sampleArticles} />
      </div>
    </Container>
  );
};

export default ArticlesPage;
