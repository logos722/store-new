import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.scss';
import { Footer, Header } from '../components';
import styles from './layout.module.scss';
import ClientProviders from '@/components/сlientProviders/ClientProviders';

// Оптимизированная загрузка шрифта с preload и display swap
const montserrat = Montserrat({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap', // Улучшает производительность загрузки шрифтов
  preload: true,
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
        {/* Preconnect для улучшения производительности */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch для внешних ресурсов */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />

        {/* Preload критически важных ресурсов - шрифты загружаются через next/font/google */}

        {/* Манифест для PWA */}
        <link rel="manifest" href="/site.webmanifest" />

        {/* Фавиконы для всех устройств */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Microsoft Tiles */}
        <meta name="msapplication-config" content="/browserconfig.xml" />
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
        </ClientProviders>

        {/* Структурированные данные добавляются на каждой странице индивидуально */}
      </body>
    </html>
  );
}
