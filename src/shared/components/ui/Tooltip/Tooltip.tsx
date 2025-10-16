'use client';

import React, { useState, useRef, useEffect, ReactNode } from 'react';
import styles from './Tooltip.module.scss';

interface TooltipProps {
  /** Контент тултипа */
  content: string;
  /** Дочерние элементы, над которыми появляется тултип */
  children: ReactNode;
  /** Позиция тултипа относительно элемента */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Задержка перед показом тултипа в миллисекундах */
  delay?: number;
  /** Отключить тултип */
  disabled?: boolean;
  /** Класс для кастомизации */
  className?: string;
}

/**
 * Переиспользуемый компонент тултипа
 * Поддерживает как hover (desktop), так и touch (mobile) взаимодействия
 *
 * @example
 * <Tooltip content="Полное название продукта">
 *   <span>Название...</span>
 * </Tooltip>
 */
const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 300,
  disabled = false,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Определяем мобильное устройство
  useEffect(() => {
    const checkMobile = () => {
      // Более точное определение мобильного устройства
      // Проверяем user agent и размер экрана вместе с touch support
      const isTouchDevice =
        'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isMobileUserAgent =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );
      const isSmallScreen = window.innerWidth < 768;

      // Считаем устройство мобильным только если это touch + (mobile UA или маленький экран)
      const isMobileDevice =
        isTouchDevice && (isMobileUserAgent || isSmallScreen);

      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Очистка таймаута при размонтировании
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  /**
   * Обработчик наведения мыши (desktop)
   */
  const handleMouseEnter = (e: React.MouseEvent) => {
    if (disabled || isMobile) return;

    // Предотвращаем всплытие события чтобы не мешать родительским onClick
    e.stopPropagation();

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  /**
   * Обработчик ухода мыши (desktop)
   */
  const handleMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  /**
   * Обработчик клика (mobile)
   * На мобильных устройствах показываем тултип по клику
   */
  const handleClick = (e: React.MouseEvent) => {
    if (disabled || !isMobile) return;

    e.stopPropagation();
    setIsVisible(prev => !prev);
  };

  /**
   * Закрытие тултипа при клике вне элемента (mobile)
   */
  useEffect(() => {
    if (!isMobile || !isVisible) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobile, isVisible]);

  // Если тултип отключен и не видим - не рендерим wrapper
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <div
      ref={tooltipRef}
      className={`${styles.tooltipWrapper} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {children}
      {isVisible && content && (
        <div
          className={`${styles.tooltip} ${styles[position]}`}
          role="tooltip"
          aria-live="polite"
        >
          <div className={styles.tooltipContent}>{content}</div>
          <div className={styles.tooltipArrow} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
