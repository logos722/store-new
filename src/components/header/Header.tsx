'use client';
import React from 'react';
import HeaderSearchField from './HeaderSearchField';
import Cart from '@/shared/components/cart/Cart';
import styles from './Header.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaBars,
  FaBoxOpen,
  FaHeart,
  FaMapMarkerAlt,
  FaUser,
} from 'react-icons/fa';
import { useAuthModal } from '@/context/authModalProvider/AuthModalContext';
import { useFavoritesStore } from '@/store/useFavoritesStore';

const MENU = [
  { href: '/', label: 'Главная' },
  { href: '/catalog', label: 'Каталог' },
  { href: '/articles', label: 'Статьи' },
];

const Header = () => {
  const pathname = usePathname();
  // const { favoritesQuenty } = useFavoritesStore(s => ({
  //   favoritesQuenty: s.favoriteQuenty,
  // }));
  const favoritesCount = useFavoritesStore(s => s.ids.length);

  const { open } = useAuthModal();

  // const favoritesCount = favoritesQuenty();

  return (
    <header className={styles.header}>
      <div className={styles.row}>
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>
            Гелион
          </Link>

          <button className={styles.btnCategories}>
            <FaBars /> Категории
          </button>
        </div>

        <div className={styles.searchRow}>
          <div className={styles.searchInput}>
            <HeaderSearchField />
          </div>
        </div>

        <div className={styles.right}>
          <Link href="/orders" className={styles.iconLink}>
            <FaBoxOpen />
            <span className={styles.badge}>3</span>
          </Link>
          <Link href="/favorites" className={styles.iconLink}>
            <FaHeart />
            <span className={styles.badge}>{favoritesCount}</span>
          </Link>
          <Cart />
          <button className={styles.signIn} onClick={open}>
            <FaUser /> Войти
          </button>
        </div>
      </div>

      <div className={styles.navLocationWrapper}>
        <div className={styles.location}>
          <FaMapMarkerAlt /> Москва
        </div>
        <nav className={styles.nav}>
          {MENU.map(m => (
            <Link
              key={m.href}
              href={m.href}
              className={pathname === m.href ? styles.active : ''}
            >
              {m.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
