import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.scss';
import { Footer, Header } from '../components';
import styles from './layout.module.scss';
import ClientProviders from '@/components/сlientProviders/ClientProviders';
import MobileBottomNavigation from '@/shared/components/mobileBottomNavigation/MobileBottomNavigation';
import { AnalyticsProvider } from '@/context/analytics/AnalyticsProvider';
import { ANALYTICS_CONFIG } from '@/constants/analytics';
import { WebVitalsReporter } from '@/components/webVitals/WebVitalsReporter';
import { WEB_VITALS_CONFIG } from '@/constants/webVitals';

/**
 * ОПТИМИЗАЦИЯ ШРИФТОВ
 *
 * 🎯 Стратегия загрузки:
 * - display: 'swap' - показывает fallback шрифт до загрузки Montserrat (улучшает FCP)
 * - preload: true - Next.js автоматически добавляет <link rel="preload">
 * - adjustFontFallback: true - минимизирует layout shift при загрузке шрифта
 *
 * 📊 Размер загрузки (приблизительно):
 * - 400: ~30KB, 500: ~32KB, 600: ~33KB, 700: ~35KB
 * - Всего: ~130KB (с сжатием gzip ~40-50KB)
 *
 * ⚡ Оптимизация: все 4 веса активно используются в проекте (проверено grep)
 */
const montserrat = Montserrat({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
  fallback: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Arial',
    'sans-serif',
  ],
  variable: '--font-montserrat',
});

// SEO-оптимизированные метаданные для корневого layout
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || 'https://gelionaqua.ru',
  ),
  title: {
    default: 'Гелион - Интернет-магазин сантехники',
    template: '%s | Гелион',
  },
  description:
    'Гелион - ведущий интернет-магазин сантехники и строительных материалов. Трубы ПВХ, фитинги, сантехника, инструменты. Низкие цены, быстрая доставка по России.',
  keywords: [
    'сантехника',
    'трубы ПВХ',
    'фитинги',
    'строительные материалы',
    'интернет-магазин',
    'доставка',
    'низкие цены',
    'Гелион',
  ],
  authors: [{ name: 'Гелион' }],
  creator: 'Гелион',
  publisher: 'Гелион',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: '/',
    siteName: 'Гелион',
    title: 'Гелион - Интернет-магазин сантехники',
    description:
      'Ведущий интернет-магазин сантехники и строительных материалов. Широкий ассортимент, низкие цены, быстрая доставка.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Гелион - Интернет-магазин сантехники',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Гелион - Интернет-магазин сантехники',
    description:
      'Ведущий интернет-магазин сантехники и строительных материалов.',
    images: ['/images/og-image.jpg'],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
  },
  category: 'shopping',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Гелион',
    'application-name': 'Гелион',
    'msapplication-TileColor': '#1976d2',
    'theme-color': '#1976d2',
    'og:logo': '/apple-icon.png',
  },
};

// Viewport конфигурация для адаптивности и производительности
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1976d2' },
    { media: '(prefers-color-scheme: dark)', color: '#1976d2' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={montserrat.variable}>
      <head>
        {/*
          ⚡ КРИТИЧЕСКИЕ СТИЛИ УДАЛЕНЫ

          Причины:
          1. body { margin: 0 } уже в globals.scss (дублирование)
          2. font-family: system-ui конфликтовало с Montserrat
          3. .hero не используется нигде в проекте

          Результат: -300 байт инлайн CSS, меньше парсинга
        */}

        {/*
          🔤 АВТОМАТИЧЕСКАЯ ОПТИМИЗАЦИЯ ШРИФТОВ

          Next.js автоматически:
          - Создает <link rel="preload" as="font"> для Montserrat
          - Генерирует self-hosted шрифты (быстрее Google Fonts CDN)
          - Добавляет font-display: swap в CSS
          - Создает CSS variables для использования в стилях
        */}

        {/* TODO: Создайте файлы в папке public/ для полной поддержки PWA и иконок:
            - site.webmanifest (манифест PWA)
            - favicon.ico (основная иконка)
            - favicon.svg (векторная иконка)
            - apple-touch-icon.png (иконка для iOS, 180x180)
            - browserconfig.xml (конфигурация для Microsoft)
        */}

        {/* Временно закомментированы ссылки на отсутствующие файлы */}
        {/* <link rel="manifest" href="/site.webmanifest" /> */}
        {/* <link rel="icon" href="/favicon.ico" sizes="any" /> */}
        {/* <link rel="icon" href="/favicon.svg" type="image/svg+xml" /> */}
        {/* <link rel="apple-touch-icon" href="/apple-touch-icon.png" /> */}
        {/* <meta name="msapplication-config" content="/browserconfig.xml" /> */}
      </head>
      <body className={`${montserrat.className} ${styles.body}`}>
        {/* Прогрессивное улучшение: показываем контент даже без JS */}
        <noscript>
          <div
            style={{
              padding: '20px',
              backgroundColor: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '4px',
              margin: '10px',
              textAlign: 'center',
            }}
          >
            Для полной функциональности сайта необходимо включить JavaScript.
          </div>
        </noscript>

        {/* Аналитика: Яндекс.Метрика + Google Analytics 4 */}
        <AnalyticsProvider config={ANALYTICS_CONFIG}>
          {/* Web Vitals: мониторинг производительности */}
          <WebVitalsReporter config={WEB_VITALS_CONFIG} />

          <ClientProviders>
            <div className={styles.layout}>
              {/* Skip to main content для доступности */}
              <a href="#main-content" className={styles.skipLink}>
                Перейти к основному содержанию
              </a>

              <Header />

              {/* Основной контент с семантической разметкой */}
              <main id="main-content" className={styles.main} role="main">
                {children}
              </main>

              <Footer />
            </div>

            {/* Мобильная нижняя навигация вынесена за пределы .layout для корректного position: fixed */}
            <MobileBottomNavigation />
          </ClientProviders>
        </AnalyticsProvider>

        {/* Структурированные данные добавляются на каждой странице индивидуально */}
      </body>
    </html>
  );
}
