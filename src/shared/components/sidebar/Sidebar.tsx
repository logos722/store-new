'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.scss';

const categories = [
  { id: 'electronics', name: 'Электроника', slug: 'electronics' },
  { id: 'clothing', name: 'Одежда', slug: 'clothing' },
  { id: 'books', name: 'Книги', slug: 'books' },
  { id: 'home', name: 'Товары для дома', slug: 'home' },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <h2>Категории</h2>
      <nav>
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/catalog/${category.slug}`}
                className={`${styles.categoryLink} ${
                  pathname === `/catalog/${category.slug}` ? styles.active : ''
                }`}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar; 