import { Metadata } from 'next';
import React from 'react';
import InfoPageLayout from '@/shared/components/infoPage/InfoPageLayout';
import { FOOTER_PAGES, SEO_META } from '@/constants/footerPages';

/**
 * Метаданные для страницы "Возврат и обмен"
 */
export const metadata: Metadata = {
  title: SEO_META.returns.title,
  description: SEO_META.returns.description,
  keywords: SEO_META.returns.keywords,
  openGraph: {
    title: SEO_META.returns.title,
    description: SEO_META.returns.description,
    type: 'website',
  },
};

/**
 * Страница "Возврат и обмен товара"
 *
 * Условия возврата и обмена товаров
 */
const ReturnsPage: React.FC = () => {
  const pageData = FOOTER_PAGES.returns;

  return (
    <InfoPageLayout
      title={pageData.title}
      sections={pageData.sections}
      cta={pageData.cta}
      ctaLink="/contact"
    />
  );
};

export default ReturnsPage;
