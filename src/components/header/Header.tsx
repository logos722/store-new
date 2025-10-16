'use client';
import React, { useState } from 'react';
import HeaderSearchField from './components/HeaderSearchField/HeaderSearchField';
import Cart from '@/shared/components/cart/Cart';
import styles from './Header.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHeart, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import { useAuthModal } from '@/context/authModalProvider/AuthModalContext';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import CategoriesDropdown from './components/categoriesDropdown/CategoriesDropdown';

const MENU = [
  { href: '/', label: 'Главная' },
  { href: '/catalog', label: 'Каталог' },
  { href: '/articles', label: 'Статьи' },
];

const Header = () => {
  const pathname = usePathname();
  const favoritesCount = useFavoritesStore(s => s.ids.length);

  const { open } = useAuthModal();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ✅ Safe handler with fallback
  const handleAuthOpen = () => {
    try {
      open();
    } catch (err) {
      console.error('Auth modal failed to open:', err);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.row}>
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>
            Гелион
          </Link>

          <CategoriesDropdown
            categories={[
              {
                id: '1',
                name: 'Каталог',
                children: [
                  {
                    id: '3',
                    name: 'ПВХ',
                    link: '/catalog/PVC',
                  },
                ],
              },
              { id: '2', name: 'Статьи', link: '/articles' },
            ]}
          />
        </div>

        <div className={styles.searchRow}>
          <div className={styles.searchInput}>
            <HeaderSearchField />
          </div>
        </div>

        <div className={styles.right}>
          <Link href="/favorites" className={styles.iconLink}>
            <FaHeart />
            <span className={styles.badge}>{favoritesCount}</span>
          </Link>
          <Cart />
          <button className={styles.signIn} onClick={() => handleAuthOpen()}>
            <FaUser /> Войти
          </button>
        </div>
      </div>

      <div className={styles.navLocationWrapper}>
        <div className={styles.location}>
          <FaMapMarkerAlt /> Краснодар
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

      {isMobileMenuOpen && (
        <div className={styles.mobileNav}>
          {MENU.map(m => (
            <Link
              key={m.href}
              href={m.href}
              className={pathname === m.href ? styles.active : ''}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {m.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
