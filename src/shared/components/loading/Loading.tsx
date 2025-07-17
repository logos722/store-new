// src/shared/components/Loading/Loading.tsx
'use client';

import React from 'react';
import Spinner from '@/shared/components/spinner/Spinner';
import styles from './Loading.module.scss';

interface LoadingProps {
  /** Флаг — показывать ли индикатор */
  isLoading: boolean;
  /** Текст рядом со спиннером (по умолчанию "Загрузка...") */
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({
  isLoading,
  message = 'Загрузка...',
}) => {
  if (!isLoading) return null;

  return (
    <div className={styles.loadingContainer}>
      <Spinner isLoading={true} />
      <span className={styles.loadingText}>{message}</span>
    </div>
  );
};

export default Loading;
