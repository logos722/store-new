import { Metadata } from 'next';
import React from 'react';
import InfoPageLayout from '@/shared/components/infoPage/InfoPageLayout';
import { FOOTER_PAGES, SEO_META } from '@/constants/footerPages';

/**
 * Метаданные для страницы "О компании"
 * Оптимизированы для SEO
 */
export const metadata: Metadata = {
  title: SEO_META.about.title,
  description: SEO_META.about.description,
  keywords: SEO_META.about.keywords,
  openGraph: {
    title: SEO_META.about.title,
    description: SEO_META.about.description,
    type: 'website',
  },
};

/**
 * Страница "О компании Гелион"
 *
 * Описывает историю компании, миссию, ценности и преимущества
 * Использует переиспользуемый InfoPageLayout для единообразного дизайна
 */
const AboutPage: React.FC = () => {
  const pageData = FOOTER_PAGES.about;

  return (
    <InfoPageLayout
      title={pageData.title}
      sections={pageData.sections}
      cta={pageData.cta}
      ctaLink="/catalog"
    />
  );
};

export default AboutPage;
