import { Metadata } from 'next';
import React from 'react';
import InfoPageLayout from '@/shared/components/infoPage/InfoPageLayout';
import { COMPANY_INFO, FOOTER_PAGES, SEO_META } from '@/constants/footerPages';

/**
 * Метаданные для страницы "Где нас найти"
 */
export const metadata: Metadata = {
  title: SEO_META.location.title,
  description: SEO_META.location.description,
  keywords: SEO_META.location.keywords,
  openGraph: {
    title: SEO_META.location.title,
    description: SEO_META.location.description,
    type: 'website',
  },
};

/**
 * Страница "Где нас найти"
 *
 * Информация о местоположении офиса и склада с картой
 */
const LocationPage: React.FC = () => {
  const pageData = FOOTER_PAGES.location;

  return (
    <InfoPageLayout
      title={pageData.title}
      sections={pageData.sections}
      includeMap={pageData.includeMap}
      // Координаты: г. Краснодар, ул. Уральская, 83, 1а
      mapCenter={[45.035719, 39.061731]}
      mapAddress={COMPANY_INFO.contact.address}
      mapOrganizationName={COMPANY_INFO.name}
      mapZoom={16}
    />
  );
};

export default LocationPage;
