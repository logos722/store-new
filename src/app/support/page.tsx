import { Metadata } from 'next';
import React from 'react';
import InfoPageLayout from '@/shared/components/infoPage/InfoPageLayout';
import { FOOTER_PAGES, SEO_META } from '@/constants/footerPages';

/**
 * Метаданные для страницы "Поддержка"
 */
export const metadata: Metadata = {
  title: SEO_META.support.title,
  description: SEO_META.support.description,
  keywords: SEO_META.support.keywords,
  openGraph: {
    title: SEO_META.support.title,
    description: SEO_META.support.description,
    type: 'website',
  },
};

/**
 * Страница "Техническая поддержка"
 *
 * Информация о службе поддержки и способах связи
 */
const SupportPage: React.FC = () => {
  const pageData = FOOTER_PAGES.support;

  return (
    <InfoPageLayout
      title={pageData.title}
      sections={pageData.sections}
      cta={pageData.cta}
      ctaLink="/contact"
    />
  );
};

export default SupportPage;
