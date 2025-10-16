import { Metadata } from 'next';
import React from 'react';
import InfoPageLayout from '@/shared/components/infoPage/InfoPageLayout';
import { FOOTER_PAGES, SEO_META } from '@/constants/footerPages';

/**
 * Метаданные для страницы FAQ
 */
export const metadata: Metadata = {
  title: SEO_META.faq.title,
  description: SEO_META.faq.description,
  keywords: SEO_META.faq.keywords,
  openGraph: {
    title: SEO_META.faq.title,
    description: SEO_META.faq.description,
    type: 'website',
  },
};

/**
 * Страница "Часто задаваемые вопросы"
 *
 * Ответы на популярные вопросы о работе интернет-магазина
 */
const FAQPage: React.FC = () => {
  const pageData = FOOTER_PAGES.faq;

  return <InfoPageLayout title={pageData.title} sections={pageData.sections} />;
};

export default FAQPage;
