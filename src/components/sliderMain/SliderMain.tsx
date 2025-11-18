import React from 'react';
import styles from './SliderMain.module.scss';
import { StaticImageData } from 'next/image';
import { SliderBase } from '../../shared/components';

interface IProps {
  images: { src: string | StaticImageData; alt: string; url: string }[];
}

const SliderMain: React.FC<IProps> = ({ images }) => {
  return (
    <div className={styles.sliderContainer}>
      <SliderBase images={images} />
    </div>
  );
};

export default SliderMain;
