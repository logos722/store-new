import React from 'react';
import Container from '@/shared/components/container/Container';
import styles from './CatalogPage.module.scss';
import { CatalogId, CatalogInfo } from '@/constants/catalogs';
import Image from 'next/image';
import { LinkTrack } from '@/shared/components/linkTrack/LinkTrack';

const CatalogPage = () => {
  const ids = Object.values(CatalogId);

  return (
    <Container>
      <div className={styles.catalogPage}>
        <h1>Каталог товаров</h1>
        <div className={styles.categories}>
          {ids.map(id => {
            const category = CatalogInfo[id];

            return (
              <LinkTrack
                href={`/catalog/${id}`}
                key={id}
                className={styles.categoryCard}
              >
                <div className={styles.categoryImage}>
                  <Image
                    src={category.imageUrl}
                    alt={category.title}
                    className={styles.image}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h2>{category.title}</h2>
                <p>{category.description}</p>
              </LinkTrack>
            );
          })}
        </div>
      </div>
    </Container>
  );
};

export default CatalogPage;
