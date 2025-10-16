import { Metadata } from 'next';
import React from 'react';
import InfoPageLayout from '@/shared/components/infoPage/InfoPageLayout';
import { FOOTER_PAGES, SEO_META } from '@/constants/footerPages';

/**
 * Метаданные для страницы "Партнеры"
 */
export const metadata: Metadata = {
  title: SEO_META.partners.title,
  description: SEO_META.partners.description,
  keywords: SEO_META.partners.keywords,
  openGraph: {
    title: SEO_META.partners.title,
    description: SEO_META.partners.description,
    type: 'website',
  },
};

/**
 * Страница "Наши партнеры"
 *
 * Информация о партнерской программе и условиях сотрудничества
 */
const PartnersPage: React.FC = () => {
  const pageData = FOOTER_PAGES.partners;

  return (
    <InfoPageLayout
      title={pageData.title}
      sections={pageData.sections}
      cta={pageData.cta}
      ctaLink="/contact"
    />
  );
};

export default PartnersPage;
