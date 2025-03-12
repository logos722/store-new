import React from 'react';
import ArticleItem from './ArticleItem';
import styles from './ArticleList.module.scss';

interface Article {
  id: string;
  title: string;
  previewImage: string;
  slug: string;
}

interface ArticleListProps {
  articles: Article[];
}

const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
  return (
    <div className={styles.articleList}>
      {articles.map(article => (
        <ArticleItem
          key={article.id}
          title={article.title}
          previewImage={article.previewImage}
          slug={article.slug}
        />
      ))}
    </div>
  );
};

export default ArticleList;
