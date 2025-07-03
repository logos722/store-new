'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import styles from './BackButton.module.scss';

interface BackButtonProps {
  /** Если в истории нет куда “back”, перейти сюда */
  fallbackHref?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ fallbackHref = '/catalog' }) => {
  const router = useRouter();

  const handleClick = () => {
    // Если в истории есть предыдущая страница — просто откатимся
    if (window.history.length > 2) {
      router.back();
    } else {
      // Иначе явно переходим на каталог
      router.push(fallbackHref);
    }
  };

  return (
    <button onClick={handleClick} className={styles.backButton}>
      <FaArrowLeft className={styles.icon} />
      Назад
    </button>
  );
};

export default BackButton;