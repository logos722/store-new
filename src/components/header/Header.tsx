'use client';
import React, { useState } from 'react';
import HeaderSearchField from './components/HeaderSearchField/HeaderSearchField';
import MobileHeaderSearchField from './components/MobileHeaderSearchField/MobileHeaderSearchField';
import Cart from '@/shared/components/cart/Cart';
import styles from './Header.module.scss';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHeart, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import { useAuthModal } from '@/context/authModalProvider/AuthModalContext';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import CategoriesDropdown from './components/categoriesDropdown/CategoriesDropdown';
import { IS_AUTH_ENABLED } from '@/constants/featureFlags';

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
  // Состояние расширения поиска для мобильной версии
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // ✅ Safe handler with fallback
  const handleAuthOpen = () => {
    try {
      open();
    } catch (err) {
      console.error('Auth modal failed to open:', err);
    }
  };

  // ✅ Обработчик изменения состояния расширения поиска
  const handleSearchExpandChange = (expanded: boolean) => {
    setIsSearchExpanded(expanded);
  };

  return (
    <header className={styles.header}>
      {/* ========== DESKTOP VERSION ========== */}
      <div className={`${styles.row} ${styles.desktopHeader}`}>
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
          {/* Скрываем эти элементы на мобильных устройствах - они перенесены в MobileBottomNavigation */}
          <Link
            href="/favorites"
            className={`${styles.iconLink} ${styles.hideOnMobile}`}
          >
            <FaHeart />
            <span className={styles.badge}>{favoritesCount}</span>
          </Link>
          <div className={styles.hideOnMobile}>
            <Cart />
          </div>
          {IS_AUTH_ENABLED && (
            <button
              className={`${styles.signIn} ${styles.hideOnMobile}`}
              onClick={() => handleAuthOpen()}
            >
              <FaUser /> Войти
            </button>
          )}
        </div>
      </div>

      {/* ========== MOBILE VERSION ========== */}
      {/* Grid структура: [1:2:1] в обычном состоянии, [1:1:3] при расширении поиска */}
      <div
        className={`${styles.mobileHeader} ${isSearchExpanded ? styles.searchExpanded : ''}`}
      >
        {/* Колонка 1: CategoriesDropdown с иконкой */}
        <div className={styles.mobileHeaderCol1}>
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
            iconOnly={true}
          />
        </div>

        {/* Колонка 2: Название сайта */}
        <div className={styles.mobileHeaderCol2}>
          <Link href="/" className={styles.mobileLogo}>
            Гелион
          </Link>
        </div>

        {/* Колонка 3: Поле поиска */}
        <div className={styles.mobileHeaderCol3}>
          <MobileHeaderSearchField onExpandChange={handleSearchExpandChange} />
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
