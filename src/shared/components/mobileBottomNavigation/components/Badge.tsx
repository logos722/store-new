import React from 'react';
import styles from './Badge.module.scss';

interface BadgeProps {
  count: number;
  'aria-label'?: string;
}

/**
 * Компонент бейджа для мобильной навигации
 *
 * Отображает счетчик с анимацией появления
 * Включает оптимизацию для больших чисел (99+)
 */
const Badge: React.FC<BadgeProps> = React.memo(
  ({ count, 'aria-label': ariaLabel }) => {
    // Ограничиваем отображение больших чисел
    const displayCount = count > 99 ? '99+' : count.toString();

    return (
      <span
        className={styles.badge}
        aria-label={ariaLabel || `${count} элементов`}
        role="status"
        aria-live="polite"
      >
        {displayCount}
      </span>
    );
  },
);

Badge.displayName = 'Badge';

export default Badge;
