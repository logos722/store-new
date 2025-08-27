import { Metadata } from 'next';
import { SliderMain } from '../components';
import cat1 from '../../public/cat1.jpeg';
import cat2 from '../../public/cat2.jpeg';
import cat3 from '../../public/cat3.jpeg';
import { CatalogPage } from '@/shared/components';
import Container from '@/shared/components/container/Container';
import ServerStructuredData from '@/shared/components/seo/ServerStructuredData';
import { ServerStructuredDataGenerator } from '@/shared/utils/structuredData';
import { generateHomeMetadata } from '@/shared/utils/seo';
import styles from './page.module.scss';

// Генерируем метаданные для главной страницы
export const metadata: Metadata = generateHomeMetadata();

const categoryId = '936a16d1-79a7-11e6-ab15-d017c2d57ada';

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

  return (
    <>
      {/* Структурированные данные для поисковиков */}
      <ServerStructuredData data={[organizationSchema, websiteSchema]} />

      <Container>
        <div className={styles.mainLayout}>
          <div className={styles.mainContent}>
            {/* Главный слайдер с оптимизированными изображениями */}
            <SliderMain images={images} />

            {/* Каталог товаров на главной странице */}
            <CatalogPage categoryId={categoryId} pageSize={8} />
          </div>
        </div>
      </Container>
    </>
  );
}
