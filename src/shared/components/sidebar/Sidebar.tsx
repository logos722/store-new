'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.scss';
import { CatalogId, CatalogInfo } from '@/constants/catalogs';

const categories = [
  { id: 'electronics', name: 'Электроника', slug: 'electronics' },
  { id: 'clothing', name: 'Одежда', slug: 'clothing' },
  { id: 'books', name: 'Книги', slug: 'books' },
  { id: 'home', name: 'Товары для дома', slug: 'home' },
];

const Sidebar = () => {
  const pathname = usePathname();
  const ids = Object.values(CatalogId) as CatalogId[];

  return (
    <aside className={styles.sidebar}>
      <h2>Категории</h2>
      <nav>
        <ul>
          {ids.map((id) => {
            const { title } = CatalogInfo[id];
            const href = `/catalog/${id}`;
            const isActive = pathname === href;

            return (
              <li key={id}>
                <Link
                  href={href}
                  className={`${styles.categoryLink} ${isActive ? styles.active : ''}`}
                >
                  {title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar; 