import { Metadata } from 'next';
import React from 'react';
import InfoPageLayout from '@/shared/components/infoPage/InfoPageLayout';
import { FOOTER_PAGES, SEO_META } from '@/constants/footerPages';

/**
 * Метаданные для страницы "Контакты"
 */
export const metadata: Metadata = {
  title: SEO_META.contact.title,
  description: SEO_META.contact.description,
  keywords: SEO_META.contact.keywords,
  openGraph: {
    title: SEO_META.contact.title,
    description: SEO_META.contact.description,
    type: 'website',
  },
};

/**
 * Страница "Контакты"
 *
 * Контактная информация компании с формой обратной связи
 */
const ContactPage: React.FC = () => {
  const pageData = FOOTER_PAGES.contact;

  return (
    <InfoPageLayout
      title={pageData.title}
      sections={pageData.sections}
      includeContactForm={pageData.includeContactForm}
      formFields={['Имя', 'Email', 'Телефон', 'Сообщение']}
      cta={pageData.cta}
    />
  );
};

export default ContactPage;
