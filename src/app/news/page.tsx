import { Metadata } from 'next';
import React from 'react';
import InfoPageLayout from '@/shared/components/infoPage/InfoPageLayout';
import { FOOTER_PAGES, SEO_META } from '@/constants/footerPages';

/**
 * Метаданные для страницы "Новости"
 */
export const metadata: Metadata = {
  title: SEO_META.news.title,
  description: SEO_META.news.description,
  keywords: SEO_META.news.keywords,
  openGraph: {
    title: SEO_META.news.title,
    description: SEO_META.news.description,
    type: 'website',
  },
};

/**
 * Страница "Новости компании"
 *
 * Актуальная информация о новинках, акциях и поступлениях товара
 */
const NewsPage: React.FC = () => {
  const pageData = FOOTER_PAGES.news;

  return (
    <InfoPageLayout
      title={pageData.title}
      sections={pageData.sections}
      cta={pageData.cta}
    />
  );
};

export default NewsPage;
