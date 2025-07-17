'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.scss';
import { CatalogId, CatalogInfo } from '@/constants/catalogs';

const Sidebar = () => {
  const pathname = usePathname();
  const ids = Object.values(CatalogId) as CatalogId[];

  return (
    <aside className={styles.sidebar}>
      <h2>Категории</h2>
      <nav>
        <ul>
          {ids.map(id => {
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
