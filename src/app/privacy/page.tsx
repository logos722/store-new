import React from 'react';
import type { Metadata } from 'next';
import { InfoPageLayout } from '@/shared/components';
import { FOOTER_PAGES, SEO_META } from '@/constants/footerPages';

/**
 * Генерация метаданных для страницы политики обработки персональных данных
 * Оптимизировано для SEO
 */
export const metadata: Metadata = {
  title: SEO_META.privacy.title,
  description: SEO_META.privacy.description,
  keywords: SEO_META.privacy.keywords,
  openGraph: {
    title: SEO_META.privacy.title,
    description: SEO_META.privacy.description,
    type: 'website',
  },
};

/**
 * Страница политики обработки персональных данных
 * Server Component для оптимальной производительности
 */
const PrivacyPage: React.FC = () => {
  const pageData = FOOTER_PAGES.privacy;

  return (
    <InfoPageLayout title={pageData.title} sections={pageData.sections}>
      {/* Дата последнего обновления - динамическая */}
      <div style={{ marginTop: '32px', color: '#666', fontStyle: 'italic' }}>
        Дата последнего обновления: {new Date().toLocaleDateString('ru-RU')}
      </div>
    </InfoPageLayout>
  );
};

export default PrivacyPage;
