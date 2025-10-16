import { Metadata } from 'next';
import React from 'react';
import InfoPageLayout from '@/shared/components/infoPage/InfoPageLayout';
import { FOOTER_PAGES, SEO_META } from '@/constants/footerPages';

/**
 * Метаданные для страницы "Карьера"
 */
export const metadata: Metadata = {
  title: SEO_META.careers.title,
  description: SEO_META.careers.description,
  keywords: SEO_META.careers.keywords,
  openGraph: {
    title: SEO_META.careers.title,
    description: SEO_META.careers.description,
    type: 'website',
  },
};

/**
 * Страница "Карьера в Гелион"
 *
 * Информация о вакансиях, условиях работы и преимуществах для сотрудников
 */
const CareersPage: React.FC = () => {
  const pageData = FOOTER_PAGES.careers;

  return (
    <InfoPageLayout
      title={pageData.title}
      sections={pageData.sections}
      cta={pageData.cta}
    />
  );
};

export default CareersPage;
