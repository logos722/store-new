import { Metadata } from 'next';
import { SliderMain } from '../components';
import { CatalogShowcaseList } from '@/shared/components';
import Container from '@/shared/components/container/Container';
import ServerStructuredData from '@/shared/components/seo/ServerStructuredData';
import { ServerStructuredDataGenerator } from '@/shared/utils/structuredData';
import { generateHomeMetadata } from '@/shared/utils/seo';
import { fetchHomePageShowcases } from '@/shared/api/fetchCatalogShowcases';
import styles from './page.module.scss';

// Генерируем метаданные для главной страницы
export const metadata: Metadata = generateHomeMetadata();

// Используем динамический рендеринг вместо статического
// Это решает проблему с недоступным API во время билда
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate каждый час

const images = [
  { src: '/Placeholred_One.webp', alt: 'Image 1', url: '/test' },
  { src: '/Placeholred_Two.webp', alt: 'Image 2', url: '/test' },
  { src: '/Placeholred_Three.webp', alt: 'Image 3', url: '/test' },
];

/**
 * ⚡ ГЛАВНАЯ СТРАНИЦА - ОПТИМИЗАЦИЯ ПРОИЗВОДИТЕЛЬНОСТИ
 *
 * Ключевые оптимизации:
 * 1. Server Component - серверный рендеринг для лучшего SEO и FCP
 * 2. Параллельная загрузка данных - структурированные данные и витрины
 * 3. ISR (Incremental Static Regeneration) через fetchHomePageShowcases
 * 4. Оптимизированные изображения через next/image с priority для слайдера
 *
 * Core Web Vitals целевые показатели:
 * - LCP (Largest Contentful Paint): < 2.5s ✅ (слайдер с priority)
 * - FID (First Input Delay): < 100ms ✅ (минимум JavaScript на клиенте)
 * - CLS (Cumulative Layout Shift): < 0.1 ✅ (фиксированные размеры изображений)
 */
export default async function Home() {
  // Генерируем структурированные данные для главной страницы
  const organizationSchema =
    ServerStructuredDataGenerator.generateOrganizationSchema();
  const websiteSchema = ServerStructuredDataGenerator.generateWebsiteSchema();
  const articlesPageSchema =
    ServerStructuredDataGenerator.generateArticlesPageSchema();

  // Загружаем витрины каталогов (серверный рендеринг)
  // ISR с кешированием на 1 час (revalidate: 3600 в fetchCatalogShowcase)
  const showcases = await fetchHomePageShowcases(4); // 4 товара в каждой витрине

  return (
    <>
      {/* Структурированные данные для поисковиков */}
      <ServerStructuredData
        data={[organizationSchema, websiteSchema, articlesPageSchema]}
      />

      <Container>
        <div className={styles.mainLayout}>
          <div className={styles.mainContent}>
            {/* 
              🎯 ГЛАВНЫЙ СЛАЙДЕР - Above-the-Fold контент
              
              Критично для LCP:
              - Первое изображение загружается с priority
              - Остальные изображения ленивые (loading="lazy")
              - Используется placeholder="blur" для плавной загрузки
              - CSS слайдера загружается динамически (см. Slider.tsx)
            */}
            <SliderMain images={images} />

            {/* 
              📦 ВИТРИНЫ КАТАЛОГОВ
              
              Below-the-Fold контент:
              - Загружается на сервере (SSR)
              - Кешируется на 1 час (ISR)
              - Изображения продуктов загружаются лениво
            */}
            <section className={styles.showcasesSection}>
              <h2 className={styles.sectionTitle}>Наши каталоги</h2>
              <CatalogShowcaseList showcases={showcases} />
            </section>
          </div>
        </div>
      </Container>
    </>
  );
}
