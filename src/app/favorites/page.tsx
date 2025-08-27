'use client';

import React, { useState, useCallback } from 'react';
import { useFavoritesStore } from '@/store/useFavoritesStore';
import {
  GridProductCard,
  ListProductCard,
} from '@/shared/components/productCard';
import Container from '@/shared/components/container/Container';
import styles from './FavoritesPage.module.scss';
import { FaThLarge, FaList, FaHeart } from 'react-icons/fa';
import Link from 'next/link';

/**
 * Тип отображения товаров в списке избранного
 */
type ViewMode = 'grid' | 'list';

/**
 * Компонент страницы избранных товаров
 *
 * Особенности реализации:
 * - Поддерживает два режима отображения: сетка и список
 * - Работает с обновленным useFavoritesStore, который хранит полные объекты товаров
 * - Не требует дополнительных запросов к API
 * - Оптимизирован с помощью React.memo и useCallback
 * - Поддерживает очистку всего списка избранного
 */
const FavoritesPage: React.FC = () => {
  // Состояние из Zustand store
  const products = useFavoritesStore(s => s.products);
  const clearFavorites = useFavoritesStore(s => s.clearFavorites);
  const favoriteQuenty = useFavoritesStore(s => s.favoriteQuenty);

  // Локальное состояние компонента
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  /**
   * Обработчик переключения режима отображения
   */
  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  /**
   * Обработчик очистки всего списка избранного
   */
  const handleClearFavorites = useCallback(() => {
    if (
      window.confirm('Вы уверены, что хотите удалить все товары из избранного?')
    ) {
      clearFavorites();
    }
  }, [clearFavorites]);

  // Рендер пустого состояния
  if (products.length === 0) {
    return (
      <Container>
        <div className={styles.favoritesPage}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              <FaHeart className={styles.heartIcon} />
              Избранное
            </h1>
          </div>

          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <FaHeart />
            </div>
            <h2 className={styles.emptyTitle}>Список избранного пуст</h2>
            <p className={styles.emptyDescription}>
              Добавляйте товары в избранное, нажимая на иконку сердечка на
              карточках товаров
            </p>
            <Link href="/catalog" className={styles.continueShopping}>
              Перейти к покупкам
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className={styles.favoritesPage}>
        {/* Заголовок страницы */}
        <div className={styles.header}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>
              <FaHeart className={styles.heartIcon} />
              Избранное
            </h1>
            <span className={styles.count}>
              {favoriteQuenty()} {favoriteQuenty() === 1 ? 'товар' : 'товаров'}
            </span>
          </div>

          {/* Элементы управления */}
          <div className={styles.controls}>
            {/* Переключатель режима отображения */}
            <div className={styles.viewModeToggle}>
              <button
                className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
                onClick={() => handleViewModeChange('grid')}
                aria-label="Отображение сеткой"
              >
                <FaThLarge />
              </button>
              <button
                className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
                onClick={() => handleViewModeChange('list')}
                aria-label="Отображение списком"
              >
                <FaList />
              </button>
            </div>

            {/* Кнопка очистки */}
            <button
              onClick={handleClearFavorites}
              className={styles.clearButton}
            >
              Очистить все
            </button>
          </div>
        </div>

        {/* Список товаров */}
        <div
          className={
            viewMode === 'grid' ? styles.gridContainer : styles.listContainer
          }
        >
          {products.map(product =>
            viewMode === 'grid' ? (
              <GridProductCard
                key={product.id}
                product={{
                  ...product,
                  rating: 4.5, // Можно добавить в FavoriteProduct если нужно
                  ratingCount: 25, // Можно добавить в FavoriteProduct если нужно
                }}
              />
            ) : (
              <ListProductCard key={product.id} product={product} />
            ),
          )}
        </div>
      </div>
    </Container>
  );
};

export default React.memo(FavoritesPage);
