'use client';
import React from 'react';
import { default as ReactSlider } from 'react-slick';
import Image, { StaticImageData } from 'next/image';
import styles from './Slider.module.scss';
import Link from 'next/link';

interface IProps {
  images: { src: StaticImageData; alt: string; url: string }[];
}

const Slider: React.FC<IProps> = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: 'linear',
    arrows: false,
    draggable: true,
  };

  return (
    <div className={styles.sliderContainer}>
      <ReactSlider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <Link href={image.url} target="_blank" rel="noopener noreferrer">
              <Image src={image.src} alt={image.alt} height={450} />
            </Link>
          </div>
        ))}
      </ReactSlider>
    </div>
  );
};

export default Slider;
