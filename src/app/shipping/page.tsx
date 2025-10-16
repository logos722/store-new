import { Metadata } from 'next';
import React from 'react';
import InfoPageLayout from '@/shared/components/infoPage/InfoPageLayout';
import { FOOTER_PAGES, SEO_META } from '@/constants/footerPages';

/**
 * Метаданные для страницы "Доставка"
 */
export const metadata: Metadata = {
  title: SEO_META.shipping.title,
  description: SEO_META.shipping.description,
  keywords: SEO_META.shipping.keywords,
  openGraph: {
    title: SEO_META.shipping.title,
    description: SEO_META.shipping.description,
    type: 'website',
  },
};

/**
 * Страница "Доставка"
 *
 * Условия доставки, способы и стоимость
 */
const ShippingPage: React.FC = () => {
  const pageData = FOOTER_PAGES.shipping;

  return (
    <InfoPageLayout
      title={pageData.title}
      sections={pageData.sections}
      cta={pageData.cta}
      ctaLink="/contact"
    />
  );
};

export default ShippingPage;
