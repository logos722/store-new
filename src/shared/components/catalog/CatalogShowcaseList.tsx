'use client';

import React from 'react';
import { CatalogShowcase as CatalogShowcaseType } from '@/types/catalog';
import CatalogShowcase from './CatalogShowcase';
import Spinner from '../spinner/Spinner';
import styles from './CatalogShowcaseList.module.scss';

interface CatalogShowcaseListProps {
  /** Список витрин каталогов */
  showcases: CatalogShowcaseType[];
  /** Флаг загрузки */
  isLoading?: boolean;
  /** Сообщение об ошибке */
  error?: string | null;
}

/**
 * Компонент списка витрин каталогов для главной страницы
 * Отображает несколько категорий товаров в формате витрин
 */
const CatalogShowcaseList: React.FC<CatalogShowcaseListProps> = ({
  showcases,
  isLoading = false,
  error = null,
}) => {
  // Обработка ошибки
  if (error) {
    return (
      <div className={styles.error}>
        <div className={styles.errorContent}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="#dc2626"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h3>Произошла ошибка</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className={styles.retryButton}
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  // Обработка состояния загрузки
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner isLoading={true} />
        <p className={styles.loadingText}>Загружаем каталоги...</p>
      </div>
    );
  }

  // Обработка пустого состояния
  if (!showcases || showcases.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyContent}>
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 2L7 6H3C2.46957 6 1.96086 6.21071 1.58579 6.58579C1.21071 6.96086 1 7.46957 1 8V19C1 19.5304 1.21071 20.0391 1.58579 20.4142C1.96086 20.7893 2.46957 21 3 21H21C21.5304 21 22.0391 20.7893 22.4142 20.4142C22.7893 20.0391 23 19.5304 23 19V8C23 7.46957 22.7893 6.96086 22.4142 6.58579C22.0391 6.21071 21.5304 6 21 6H17L15 2H9Z"
              stroke="#999"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z"
              stroke="#999"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h3>Каталоги не найдены</h3>
          <p>В данный момент нет доступных категорий товаров</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.showcaseList}>
      {showcases.map(showcase => (
        <CatalogShowcase key={showcase.categoryId} showcase={showcase} />
      ))}
    </div>
  );
};

export default CatalogShowcaseList;
