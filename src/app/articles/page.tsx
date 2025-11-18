import React from 'react';
import ArticleList from '@/shared/components/articles/ArticleList';
import Container from '@/shared/components/container/Container';
import styles from './page.module.scss';
import Breadcrumbs from '@/shared/components/seo/Breadcrumbs';
import { Metadata } from 'next';
import { ServerStructuredDataGenerator } from '@/shared/utils/structuredData';
import ServerStructuredData from '@/shared/components/seo/ServerStructuredData';
import { generateArticlesMetadata } from '@/shared/utils/seo';

const sampleArticles = [
  {
    id: '1',
    title: 'Как выбрать идеальный продукт',
    previewImage: '/Placeholred_One.webp',
    slug: 'how-to-choose-perfect-product',
  },
  {
    id: '2',
    title: 'Топ-10 трендов этого сезона',
    previewImage: '/Placeholred_Two.webp',
    slug: 'top-10-trends-this-season',
  },
  {
    id: '3',
    title: 'Советы по уходу за продуктами',
    previewImage: '/Placeholred_Three.webp',
    slug: 'product-care-tips',
  },
  {
    id: '4',
    title: 'Советы по уходу за продуктами',
    previewImage: '/Placeholred_Three.webp',
    slug: 'product-care-tips',
  },
];
export const metadata: Metadata = generateArticlesMetadata();

const ArticlesPage = () => {
  const articlesPageSchema =
    ServerStructuredDataGenerator.generateArticlesPageSchema();

  return (
    <Container>
      <ServerStructuredData data={[articlesPageSchema]} />
      <Breadcrumbs />

      <div className={styles.articleDiv}>
        <h1>Статьи</h1>
        <ArticleList articles={sampleArticles} />
      </div>
    </Container>
  );
};

export default ArticlesPage;
