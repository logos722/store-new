import React from 'react';
import styles from './Alert.module.scss';
import { FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';

interface IProps {
  message: string;
  onRetry?: () => void;
  type?: 'error' | 'warning' | 'info';
}

const Alert: React.FC<IProps> = ({ message, onRetry, type = 'error' }) => {
  const icons = {
    error: <FaExclamationCircle />,
    warning: <FaExclamationCircle />,
    info: <FaInfoCircle />,
  };

  return (
    <div className={`${styles.alert} ${styles[type]}`}>
      <span className={styles.icon}>{icons[type]}</span>
      <span className={styles.message}>{message}</span>
      {onRetry && (
        <button onClick={onRetry} className={styles.retry}>
          Повторить
        </button>
      )}
    </div>
  );
};

export default Alert;
