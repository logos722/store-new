import { SliderMain } from '../components';
import cat1 from '../../public/cat1.jpeg';
import cat2 from '../../public/cat2.jpeg';
import cat3 from '../../public/cat3.jpeg';
import {CatalogPage} from '@/shared/components';
import Container from '@/shared/components/container/Container';
import { Sidebar } from '@/shared/components';
import styles from './page.module.scss';

  const categoryId = '936a16d1-79a7-11e6-ab15-d017c2d57ada';


const images = [
  { src: cat1, alt: 'Image 1', url: '/test' },
  { src: cat2, alt: 'Image 2', url: '/test' },
  { src: cat3, alt: 'Image 3', url: '/test' },
];

export default async  function Home() {

  return (
    <Container>
      <div className={styles.mainLayout}>
        <Sidebar />
        <div className={styles.mainContent}>
          <SliderMain images={images} />
          <CatalogPage categoryId={categoryId} pageSize={6} />
        </div>
      </div>
    </Container>
  );
}
