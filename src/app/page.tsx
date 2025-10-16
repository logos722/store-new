import { Metadata } from 'next';
import { SliderMain } from '../components';
import cat1 from '../../public/cat1.jpeg';
import cat2 from '../../public/cat2.jpeg';
import cat3 from '../../public/cat3.jpeg';
import { CatalogShowcaseList } from '@/shared/components';
import Container from '@/shared/components/container/Container';
import ServerStructuredData from '@/shared/components/seo/ServerStructuredData';
import { ServerStructuredDataGenerator } from '@/shared/utils/structuredData';
import { generateHomeMetadata } from '@/shared/utils/seo';
import { fetchHomePageShowcases } from '@/shared/api/fetchCatalogShowcases';
import styles from './page.module.scss';

// Генерируем метаданные для главной страницы
export const metadata: Metadata = generateHomeMetadata();

const images = [
  { src: cat1, alt: 'Image 1', url: '/test' },
  { src: cat2, alt: 'Image 2', url: '/test' },
  { src: cat3, alt: 'Image 3', url: '/test' },
];

export default async function Home() {
  // Генерируем структурированные данные для главной страницы
  const organizationSchema =
    ServerStructuredDataGenerator.generateOrganizationSchema();
  const websiteSchema = ServerStructuredDataGenerator.generateWebsiteSchema();

  // Загружаем витрины каталогов (серверный рендеринг)
  const showcases = await fetchHomePageShowcases(4); // 4 товара в каждой витрине

  return (
    <>
      {/* Структурированные данные для поисковиков */}
      <ServerStructuredData data={[organizationSchema, websiteSchema]} />

      <Container>
        <div className={styles.mainLayout}>
          <div className={styles.mainContent}>
            {/* Главный слайдер с оптимизированными изображениями */}
            <SliderMain images={images} />

            {/* Витрины каталогов на главной странице */}
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
