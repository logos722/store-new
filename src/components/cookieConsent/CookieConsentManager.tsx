'use client';

/**
 * Cookie Consent Manager
 *
 * Управляет отображением Cookie Consent баннера и
 * синхронизирует выбор пользователя с AnalyticsProvider
 */

import React from 'react';
import { useAnalytics } from '@/context/analytics/AnalyticsProvider';
import { ANALYTICS_CONFIG } from '@/constants/analytics';
import { CookieConsent, CookieConsentPreferences } from './CookieConsent';

export function CookieConsentManager() {
  const { setConsent } = useAnalytics();

  // Показываем Cookie Consent только если requireConsent=true и есть хотя бы одна аналитика
  const shouldShowConsent =
    ANALYTICS_CONFIG.requireConsent &&
    (ANALYTICS_CONFIG.yandexMetrika || ANALYTICS_CONFIG.googleAnalytics);

  // Если consent не требуется, сразу разрешаем аналитику
  // Хук должен вызываться безусловно (правило React Hooks)
  React.useEffect(() => {
    if (
      !shouldShowConsent &&
      (ANALYTICS_CONFIG.yandexMetrika || ANALYTICS_CONFIG.googleAnalytics)
    ) {
      setConsent(true);
    }
  }, [shouldShowConsent, setConsent]);

  const handleConsentChange = (preferences: CookieConsentPreferences) => {
    // Разрешаем загрузку аналитики, если пользователь согласился
    setConsent(preferences.analytics);

    if (ANALYTICS_CONFIG.debug) {
      console.log('🍪 Cookie Consent:', preferences);
    }
  };

  if (!shouldShowConsent) {
    return null;
  }

  return <CookieConsent onConsentChange={handleConsentChange} />;
}
