import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './ArticleItem.module.scss';

interface ArticleItemProps {
  title: string;
  previewImage: string;
  slug: string;
}

const ArticleItem: React.FC<ArticleItemProps> = ({
  title,
  previewImage,
  slug,
}) => {
  return (
    <Link href={`/articles/${slug}`} className={styles.articleItem}>
      <div className={styles.imageWrapper}>
        <Image
          src={previewImage}
          alt={title}
          width={300}
          height={200}
          className={styles.image}
        />
      </div>
      <h3 className={styles.title}>{title}</h3>
    </Link>
  );
};

export default ArticleItem;
