'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import styles from './OptimizedImage.module.scss';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  /**
   * Показывать ли placeholder во время загрузки
   */
  showPlaceholder?: boolean;

  /**
   * Кастомный placeholder компонент
   */
  placeholder?: React.ReactNode;

  /**
   * Показывать ли индикатор загрузки
   */
  showLoader?: boolean;

  /**
   * CSS класс для контейнера
   */
  containerClassName?: string;

  /**
   * Обработчик успешной загрузки
   */
  onLoadComplete?: () => void;

  /**
   * Обработчик ошибки загрузки
   */
  onError?: () => void;

  /**
   * Fallback изображение при ошибке
   */
  fallbackSrc?: string;
}

/**
 * Оптимизированный компонент изображения с поддержкой SEO и производительности
 *
 * Особенности:
 * - Автоматическая оптимизация размеров и форматов
 * - Lazy loading по умолчанию
 * - Placeholder и loader состояния
 * - Fallback для ошибок загрузки
 * - Поддержка WebP и AVIF форматов
 * - Адаптивные изображения
 * - SEO-оптимизированные alt теги
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  showPlaceholder = true,
  placeholder,
  showLoader = true,
  containerClassName = '',
  onLoadComplete,
  onError,
  fallbackSrc = '/images/placeholder.jpg',
  priority = false,
  quality = 85,
  sizes,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  /**
   * Обработчик успешной загрузки изображения
   */
  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoadComplete?.();
  };

  /**
   * Обработчик ошибки загрузки изображения
   */
  const handleError = () => {
    setIsLoading(false);
    setHasError(true);

    // Пытаемся загрузить fallback изображение
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
      setHasError(false);
      setIsLoading(true);
    }

    onError?.();
  };

  /**
   * Генерируем оптимизированный alt текст
   */
  const optimizedAlt = alt || 'Изображение товара';

  /**
   * Генерируем sizes для адаптивных изображений
   */
  const responsiveSizes =
    sizes ||
    `
    (max-width: 480px) 100vw,
    (max-width: 768px) 50vw,
    (max-width: 1200px) 33vw,
    25vw
  `;

  return (
    <div className={`${styles.container} ${containerClassName}`}>
      {/* Placeholder во время загрузки */}
      {isLoading && showPlaceholder && (
        <div className={styles.placeholder}>
          {placeholder || (
            <div className={styles.defaultPlaceholder}>
              {showLoader && <div className={styles.loader} />}
            </div>
          )}
        </div>
      )}

      {/* Основное изображение */}
      <Image
        src={imageSrc}
        alt={optimizedAlt}
        onLoad={handleLoad}
        onError={handleError}
        priority={priority}
        quality={quality}
        sizes={responsiveSizes}
        className={`${styles.image} ${isLoading ? styles.loading : ''} ${hasError ? styles.error : ''}`}
        // Оптимизации для SEO и производительности
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        {...props}
      />

      {/* Overlay для состояния ошибки */}
      {hasError && imageSrc === fallbackSrc && (
        <div className={styles.errorOverlay}>
          <span className={styles.errorText}>Изображение недоступно</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
