import { Metadata } from 'next';
import React from 'react';
import InfoPageLayout from '@/shared/components/infoPage/InfoPageLayout';
import { FOOTER_PAGES, SEO_META } from '@/constants/footerPages';

/**
 * Метаданные для страницы "Обратная связь"
 */
export const metadata: Metadata = {
  title: SEO_META.feedback.title,
  description: SEO_META.feedback.description,
  keywords: SEO_META.feedback.keywords,
  openGraph: {
    title: SEO_META.feedback.title,
    description: SEO_META.feedback.description,
    type: 'website',
  },
};

/**
 * Страница "Обратная связь"
 *
 * Форма для отзывов и обращений клиентов
 */
const FeedbackPage: React.FC = () => {
  const pageData = FOOTER_PAGES.feedback;

  return (
    <InfoPageLayout
      title={pageData.title}
      sections={pageData.sections}
      includeFeedbackForm={pageData.includeFeedbackForm}
      formFields={pageData.formFields}
      cta={pageData.cta}
    />
  );
};

export default FeedbackPage;
