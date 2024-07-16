import Image, { StaticImageData } from 'next/image';
import React from 'react';
import styles from './IconLink.module.scss';
import Link from 'next/link';

interface IProps {
  icon: StaticImageData;
  href: string;
  alt: string;
  target?: '_blank' | '_self';
  size?: number; // Размер иконки
  count?: number; // Число для отображения
}

const IconLink: React.FC<IProps> = ({
  icon,
  href,
  alt,
  target = '_self',
  size = 24,
  count,
}) => {
  return (
    <div className={styles.container}>
      <Link href={href} target={target} className={styles.link}>
        <Image src={icon} alt={alt} width={size} height={size} />
        {count !== undefined && <span className={styles.count}>{count}</span>}
      </Link>
    </div>
  );
};

export default IconLink;
