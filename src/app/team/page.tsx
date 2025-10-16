import { Metadata } from 'next';
import React from 'react';
import InfoPageLayout from '@/shared/components/infoPage/InfoPageLayout';
import { FOOTER_PAGES, SEO_META } from '@/constants/footerPages';

/**
 * Метаданные для страницы "Команда"
 */
export const metadata: Metadata = {
  title: SEO_META.team.title,
  description: SEO_META.team.description,
  keywords: SEO_META.team.keywords,
  openGraph: {
    title: SEO_META.team.title,
    description: SEO_META.team.description,
    type: 'website',
  },
};

/**
 * Страница "Наша команда"
 *
 * Представляет команду профессионалов и отделы компании Гелион
 */
const TeamPage: React.FC = () => {
  const pageData = FOOTER_PAGES.team;

  return (
    <InfoPageLayout
      title={pageData.title}
      sections={pageData.sections}
      cta={pageData.cta}
      ctaLink="/contact"
    />
  );
};

export default TeamPage;
