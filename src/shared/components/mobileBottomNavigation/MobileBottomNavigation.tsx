'use client';
import React from 'react';
import Link from 'next/link';
import {
  FaHeart,
  FaShoppingCart,
  FaUser,
  FaHome,
  FaList,
} from 'react-icons/fa';
import { useMobileNavigation } from '@/shared/hooks/useMobileNavigation';
import Badge from './components/Badge';
import styles from './MobileBottomNavigation.module.scss';

/**
 * Mobile Bottom Navigation Component
 *
 * Отображает нижнюю навигацию только на мобильных устройствах.
 * Включает основные функции: главная, каталог, избранное, корзина, авторизация.
 *
 * Features:
 * - Адаптивный дизайн для мобильных устройств
 * - Счетчики для избранного и корзины
 * - Обработка ошибок при открытии модальных окон
 * - Оптимизация производительности с мемоизацией
 */
const MobileBottomNavigation: React.FC = React.memo(() => {
  // Используем кастомный хук для всей логики
  const { navigationItems } = useMobileNavigation();

  /**
   * Маппинг иконок для навигационных элементов
   * Вынесен в отдельный объект для лучшей читаемости
   */
  const iconMap = {
    Главная: FaHome,
    Каталог: FaList,
    Избранное: FaHeart,
    Корзина: FaShoppingCart,
    Войти: FaUser,
  } as const;

  return (
    <nav
      className={styles.mobileBottomNav}
      role="navigation"
      aria-label="Мобильная навигация"
    >
      {navigationItems.map((item, index) => {
        const IconComponent = iconMap[item.label as keyof typeof iconMap];

        // Fallback для случая, когда иконка не найдена
        if (!IconComponent) {
          console.warn(`Icon not found for label: ${item.label}`);
          return null;
        }

        // Если это кнопка (href === null), рендерим button
        if (item.href === null) {
          return (
            <button
              key={`nav-item-${index}`}
              className={`${styles.navItem} ${item.isActive ? styles.active : ''}`}
              onClick={item.onClick}
              aria-label={item.label}
              type="button"
            >
              <div className={styles.iconWrapper}>
                <IconComponent className={styles.icon} />
                {item.badge && <Badge count={item.badge} />}
              </div>
              <span className={styles.label}>{item.label}</span>
            </button>
          );
        }

        // Если это ссылка, рендерим Link
        return (
          <Link
            key={`nav-item-${index}`}
            href={item.href}
            className={`${styles.navItem} ${item.isActive ? styles.active : ''}`}
            aria-label={item.label}
          >
            <div className={styles.iconWrapper}>
              <IconComponent className={styles.icon} />
              {item.badge && <Badge count={item.badge} />}
            </div>
            <span className={styles.label}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
});

// Добавляем displayName для лучшей отладки
MobileBottomNavigation.displayName = 'MobileBottomNavigation';

export default MobileBottomNavigation;
