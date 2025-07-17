import React from 'react';
import Link from 'next/link';
import Container from '@/shared/components/container/Container';
import styles from './CatalogPage.module.scss';
import { CatalogId, CatalogInfo } from '@/constants/catalogs';
import Image from 'next/image';

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
              <Link
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
              </Link>
            );
          })}
        </div>
      </div>
    </Container>
  );
};

export default CatalogPage;
