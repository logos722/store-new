import React from 'react';
// import styles from './SliderMain.module.scss';
import { StaticImageData } from 'next/image';
import { SliderBase } from '../../shared/components';

interface IProps {
  images: { src: StaticImageData; alt: string; url: string }[];
}

const SliderMain: React.FC<IProps> = ({ images }) => {
  return (
    <div>
      <SliderBase images={images} />
    </div>
  );
};

export default SliderMain;
