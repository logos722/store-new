'use client';
import React from 'react';
import HeaderSearchField from './HeaderSearchField';
import Cart from '@/shared/components/cart/Cart';
import styles from './Header.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUser } from 'react-icons/fa';

const Header = () => {
  const pathname = usePathname();
  const menu = [
    { href: '/',   label: 'Главная'  },
    { href: '/catalog', label: 'Каталог' },
    { href: '/articles', label: 'Статьи' },
  ];

  return (
    <nav className={styles.header}>
      <h2>Гелион</h2>

      <ul className={styles.menu}>
        {menu.map(item => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={pathname === item.href ? 'active' : ''}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className={styles.searchField}>
        <HeaderSearchField />
      </div>

      <Cart />

      <Link href="/account" className={styles.cartLink}>
        <FaUser className={styles.icon} />
      </Link>
    </nav>
  );
};

export default Header;
