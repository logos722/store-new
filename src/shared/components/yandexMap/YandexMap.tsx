'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './YandexMap.module.scss';

/**
 * Типы для Яндекс.Карт API
 */
interface YMapsGeoObjects {
  add: (geoObject: YMapsPlacemark) => void;
  remove: (geoObject: YMapsPlacemark) => void;
}

interface YMapsBehaviors {
  disable: (behavior: string) => void;
  enable: (behavior: string) => void;
}

interface YMapsMap {
  geoObjects: YMapsGeoObjects;
  behaviors: YMapsBehaviors;
  destroy: () => void;
}

interface YMapsPlacemark {
  // Минимальный интерфейс для метки
}

interface YMapsConstructor {
  Map: new (
    container: HTMLElement,
    state: {
      center: [number, number];
      zoom: number;
      controls?: string[];
    },
  ) => YMapsMap;
  Placemark: new (
    coordinates: [number, number],
    properties: {
      balloonContentHeader?: string;
      balloonContentBody?: string;
      balloonContentFooter?: string;
      hintContent?: string;
    },
    options?: {
      preset?: string;
      iconColor?: string;
    },
  ) => YMapsPlacemark;
  ready: (callback: () => void) => void;
}

/**
 * Интерфейс для пропсов компонента YandexMap
 */
export interface YandexMapProps {
  /** Координаты центра карты [широта, долгота] */
  center?: [number, number];
  /** Уровень зуммирования (0-19) */
  zoom?: number;
  /** Адрес для отображения на метке */
  address?: string;
  /** Название организации для метки */
  organizationName?: string;
  /** Высота карты */
  height?: string;
  /** API ключ Яндекс.Карт (опционально) */
  apiKey?: string;
}

/**
 * Компонент для интеграции Яндекс.Карт
 *
 * Особенности:
 * - Динамическая загрузка API Яндекс.Карт
 * - Адаптивный дизайн для мобильных устройств
 * - Обработка ошибок загрузки
 * - Оптимизация производительности через lazy loading
 * - Поддержка серверного рендеринга Next.js
 */
const YandexMap: React.FC<YandexMapProps> = ({
  center = [45.03547, 38.975313], // Координаты Краснодара, ул. Уральская, 83
  zoom = 16,
  address = 'г. Краснодар, ул. Уральская, 83, 1а',
  organizationName = 'Гелион',
  height = '400px',
  apiKey,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapInstanceRef = useRef<YMapsMap | null>(null);

  useEffect(() => {
    /**
     * Инициализация карты после загрузки API
     */
    const initMap = () => {
      // Проверяем, что API загружен и готов
      if (!window.ymaps || !mapRef.current) {
        return;
      }

      try {
        // Используем ymaps.ready для безопасной инициализации
        window.ymaps.ready(() => {
          if (!mapRef.current || mapInstanceRef.current) {
            return;
          }

          // Создаем карту
          const map = new window.ymaps.Map(mapRef.current, {
            center: center,
            zoom: zoom,
            controls: ['zoomControl', 'fullscreenControl'], // Минимальный набор контролов
          });

          // Создаем метку с информацией
          const placemark = new window.ymaps.Placemark(
            center,
            {
              balloonContentHeader: organizationName,
              balloonContentBody: address,
              balloonContentFooter: 'Нажмите для открытия в Яндекс.Картах',
              hintContent: organizationName,
            },
            {
              preset: 'islands#blueDotIcon', // Стиль метки
              iconColor: '#0095b6', // Цвет метки
            },
          );

          // Добавляем метку на карту
          map.geoObjects.add(placemark);

          // Отключаем скролл зумом для улучшения UX на мобильных
          map.behaviors.disable('scrollZoom');

          // Сохраняем ссылку на карту для возможной очистки
          mapInstanceRef.current = map;

          setIsLoading(false);
        });
      } catch (err) {
        console.error('Ошибка инициализации карты:', err);
        setError('Не удалось загрузить карту');
        setIsLoading(false);
      }
    };

    /**
     * Загрузка скрипта Яндекс.Карт
     */
    const loadYandexMapsScript = () => {
      // Проверяем, не загружен ли уже скрипт
      if (window.ymaps) {
        initMap();
        return;
      }

      // Проверяем, не загружается ли уже скрипт
      const existingScript = document.querySelector(
        'script[src*="api-maps.yandex.ru"]',
      );
      if (existingScript) {
        // Ждем загрузки существующего скрипта
        existingScript.addEventListener('load', initMap);
        existingScript.addEventListener('error', () => {
          setError('Не удалось загрузить API Яндекс.Карт');
          setIsLoading(false);
        });
        return;
      }

      // Создаем и загружаем скрипт
      const script = document.createElement('script');
      const apiUrl = apiKey
        ? `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`
        : 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';

      script.src = apiUrl;
      script.async = true;
      script.defer = true;

      script.onload = initMap;
      script.onerror = () => {
        setError('Не удалось загрузить API Яндекс.Карт');
        setIsLoading(false);
      };

      document.head.appendChild(script);
    };

    // Начинаем загрузку только на клиенте
    if (typeof window !== 'undefined') {
      loadYandexMapsScript();
    }

    // Очистка при размонтировании компонента
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [center, zoom, address, organizationName, apiKey]);

  /**
   * Обработчик клика для открытия адреса в Яндекс.Картах
   */
  const handleOpenInYandexMaps = () => {
    const url = `https://yandex.ru/maps/?text=${encodeURIComponent(address)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Отображение ошибки
  if (error) {
    return (
      <div className={styles.mapError}>
        <div className={styles.errorIcon}>⚠️</div>
        <p className={styles.errorText}>{error}</p>
        <button
          className={styles.openMapButton}
          onClick={handleOpenInYandexMaps}
          type="button"
        >
          Открыть в Яндекс.Картах
        </button>
      </div>
    );
  }

  return (
    <div className={styles.mapWrapper}>
      {/* Индикатор загрузки */}
      {isLoading && (
        <div className={styles.mapLoading}>
          <div className={styles.spinner} />
          <p>Загрузка карты...</p>
        </div>
      )}

      {/* Контейнер для карты */}
      <div
        ref={mapRef}
        className={styles.mapContainer}
        style={{ height }}
        aria-label={`Карта с местоположением: ${address}`}
      />

      {/* Кнопка для открытия в Яндекс.Картах */}
      <button
        className={styles.openMapButton}
        onClick={handleOpenInYandexMaps}
        type="button"
        aria-label="Открыть адрес в Яндекс.Картах"
      >
        Открыть в Яндекс.Картах
      </button>
    </div>
  );
};

/**
 * Расширение глобальных типов для window.ymaps
 */
declare global {
  interface Window {
    ymaps?: YMapsConstructor;
  }
}

export default YandexMap;
