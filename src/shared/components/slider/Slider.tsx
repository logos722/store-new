'use client';
import React from 'react';
import Image, { StaticImageData } from 'next/image';
import styles from './Slider.module.scss';
import Link from 'next/link';
import ReactSlider from 'react-slick';

/**
 * ⚠️ ВАЖНОЕ ПРИМЕЧАНИЕ О ПРОИЗВОДИТЕЛЬНОСТИ
 *
 * CSS для react-slick загружается глобально в globals.scss.
 * Попытка динамического импорта CSS в useEffect вызывала серьезную
 * проблему с CLS (Cumulative Layout Shift) = 0.21, т.к. стили загружались
 * ПОСЛЕ первого рендера, вызывая перерисовку слайдера.
 *
 * РЕКОМЕНДАЦИЯ: Замените react-slick на современную альтернативу:
 * - Swiper.js: лучшая производительность, tree-shaking, модульная архитектура
 * - Embla Carousel: легковесная, отличная производительность
 * - Keen Slider: нативный TypeScript, без зависимостей
 *
 * Это позволит:
 * 1. Уменьшить bundle на 20-30KB
 * 2. Избежать проблем с CLS
 * 3. Получить лучший контроль над загрузкой стилей
 */

interface IProps {
  images: { src: StaticImageData; alt: string; url: string }[];
}

const Slider: React.FC<IProps> = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: 'linear',
    arrows: false,
    draggable: true,
    lazyLoad: 'progressive' as const,
  };

  return (
    <div className={styles.sliderContainer}>
      <ReactSlider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <Link href={image.url} target="_blank" rel="noopener noreferrer">
              <Image
                src={image.src}
                alt={image.alt}
                height={450}
                width={1920} // ← ДОБАВЬТЕ width!
                quality={75} // ← Сжатие
                priority={index === 0} // ← Первый слайд приоритетный!
                loading={index === 0 ? 'eager' : 'lazy'} // ← Остальные lazy
                placeholder="blur" // ← LQIP эффект
                sizes="100vw" // ← Адаптивность
                style={{
                  // ← Предотвращение layout shift
                  width: '100%',
                  height: 'auto',
                  maxHeight: '450px',
                  objectFit: 'cover',
                }}
              />
            </Link>
          </div>
        ))}
      </ReactSlider>
    </div>
  );
};

export default Slider;
