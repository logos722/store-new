'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaChevronRight } from 'react-icons/fa';
import styles from './Breadcrumbs.module.scss';
import { StructuredDataGenerator } from './StructuredData';
import StructuredData from './StructuredData';

export interface BreadcrumbItem {
  name: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  separator?: React.ReactNode;
}

/**
 * Компонент хлебных крошек с поддержкой SEO и структурированных данных
 *
 * Особенности:
 * - Автоматическая генерация на основе URL
 * - Поддержка структурированных данных Schema.org
 * - Доступность (ARIA)
 * - Настраиваемый внешний вид
 * - Поддержка мобильных устройств
 */
const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className = '',
  showHome = true,
  separator = <FaChevronRight />,
}) => {
  const pathname = usePathname();

  // Автоматическая генерация хлебных крошек на основе URL
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items;

    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    if (showHome) {
      breadcrumbs.push({
        name: 'Главная',
        href: '/',
      });
    }

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      // Декодируем URL-кодированные символы
      const decodedSegment = decodeURIComponent(segment);

      // Преобразуем сегменты URL в читаемые названия
      let name = decodedSegment;
      switch (segment) {
        case 'catalog':
          name = 'Каталог';
          break;
        case 'favorites':
          name = 'Избранное';
          break;
        case 'cart':
          name = 'Корзина';
          break;
        case 'product':
          name = 'Товар';
          break;
        case 'articles':
          name = 'Статьи';
          break;
        case 'help':
          name = 'Помощь';
          break;
        default:
          // Для категорий и товаров используем ID как есть
          // В реальном приложении здесь можно подтягивать названия из API
          name =
            decodedSegment.charAt(0).toUpperCase() + decodedSegment.slice(1);
      }

      breadcrumbs.push({
        name,
        href: currentPath,
        current: isLast,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = generateBreadcrumbs();

  // Генерируем структурированные данные для поисковиков
  const structuredData = StructuredDataGenerator.generateBreadcrumbSchema(
    breadcrumbItems.map(item => ({
      name: item.name,
      url: item.href,
    })),
  );

  if (breadcrumbItems.length <= 1) {
    return null; // Не показываем хлебные крошки на главной странице
  }

  return (
    <>
      {/* Структурированные данные для поисковиков */}
      <StructuredData data={structuredData} />

      {/* Визуальные хлебные крошки */}
      <nav
        className={`${styles.breadcrumbs} ${className}`}
        aria-label="Навигация по сайту"
      >
        <ol
          className={styles.list}
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;

            return (
              <li
                key={item.href}
                className={`${styles.item} ${isLast ? styles.current : ''}`}
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                {/* Позиция в списке для структурированных данных */}
                <meta itemProp="position" content={(index + 1).toString()} />

                {isLast ? (
                  // Последний элемент - не ссылка
                  <span
                    className={styles.currentPage}
                    itemProp="name"
                    aria-current="page"
                  >
                    {item.name}
                  </span>
                ) : (
                  // Обычная ссылка
                  <Link
                    href={item.href}
                    className={styles.link}
                    itemProp="item"
                  >
                    <span itemProp="name">
                      {index === 0 && showHome ? (
                        <span className={styles.homeIcon}>
                          <FaHome />
                          <span className={styles.srOnly}>{item.name}</span>
                        </span>
                      ) : (
                        item.name
                      )}
                    </span>
                  </Link>
                )}

                {/* Разделитель */}
                {!isLast && (
                  <span className={styles.separator} aria-hidden="true">
                    {separator}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;
