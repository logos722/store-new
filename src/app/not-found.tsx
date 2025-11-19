import Link from 'next/link';
import { Metadata } from 'next';
import Container from '@/shared/components/container/Container';
import styles from './not-found.module.scss';

/**
 * Кастомная страница 404 - Продукт/Страница не найдена
 * Отображается при вызове notFound() или при переходе на несуществующий URL
 */

export const metadata: Metadata = {
  title: 'Страница не найдена',
  description: 'Запрошенная страница не существует или была удалена.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <Container>
      <div className={styles.notFoundContainer}>
        <div className={styles.content}>
          {/* Анимированная 404 */}
          <div className={styles.errorCode}>
            <span className={styles.digit}>4</span>
            <span className={styles.digit}>0</span>
            <span className={styles.digit}>4</span>
          </div>

          {/* Основное сообщение */}
          <h1 className={styles.title}>Страница не найдена</h1>
          <p className={styles.description}>
            К сожалению, запрошенная страница не существует или была удалена.
            <br />
            Возможно, вы перешли по устаревшей ссылке или ввели неверный адрес.
          </p>

          {/* Кнопки действий */}
          <div className={styles.actions}>
            <Link href="/" className={styles.primaryButton}>
              <svg
                className={styles.icon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              На главную
            </Link>

            <Link href="/catalog" className={styles.secondaryButton}>
              <svg
                className={styles.icon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              Перейти в каталог
            </Link>
          </div>

          {/* Дополнительная помощь */}
          <div className={styles.helpSection}>
            <p className={styles.helpTitle}>Что вы можете сделать:</p>
            <ul className={styles.helpList}>
              <li>Перейти на главную страницу и начать сначала</li>
              <li>Воспользоваться поиском по сайту</li>
              <li>Просмотреть наш каталог продукции</li>
              <li>
                Связаться с нами, если проблема повторяется:{' '}
                <Link href="/contact" className={styles.contactLink}>
                  Контакты
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Декоративный элемент */}
        <div className={styles.decoration}>
          <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.blob}
          >
            <path
              fill="currentColor"
              d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.8C64.8,56.4,53.8,69,40.4,76.8C27,84.6,11.2,87.6,-4.8,85.5C-20.8,83.4,-41.6,76.2,-56.3,65.1C-71,54,-79.6,39,-83.8,23.1C-88,7.2,-87.8,-9.6,-82.2,-24.8C-76.6,-40,-65.6,-53.6,-52.3,-61.1C-39,-68.6,-23.4,-70,-8.8,-73.8C5.8,-77.6,30.6,-83.6,44.7,-76.4Z"
              transform="translate(100 100)"
            />
          </svg>
        </div>
      </div>
    </Container>
  );
}
