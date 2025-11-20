'use client';

/**
 * Cookie Consent Manager
 *
 * Управляет отображением Cookie Consent баннера и
 * синхронизирует выбор пользователя с AnalyticsProvider
 */

import React, { useEffect, useCallback } from 'react';
import { useAnalytics } from '@/context/analytics/AnalyticsProvider';
import { ANALYTICS_CONFIG } from '@/constants/analytics';
import { CookieConsent, CookieConsentPreferences } from './CookieConsent';

export function CookieConsentManager() {
  const { setConsent } = useAnalytics();

  // Показываем Cookie Consent только если requireConsent=true и есть хотя бы одна аналитика
  const shouldShowConsent =
    ANALYTICS_CONFIG.requireConsent &&
    (ANALYTICS_CONFIG.yandexMetrika || ANALYTICS_CONFIG.googleAnalytics);

  // Debug логирование для диагностики проблем на проде
  useEffect(() => {
    if (ANALYTICS_CONFIG.debug) {
      console.log('🔍 Cookie Consent Manager Debug:', {
        shouldShowConsent,
        requireConsent: ANALYTICS_CONFIG.requireConsent,
        hasYandex: !!ANALYTICS_CONFIG.yandexMetrika,
        hasGA: !!ANALYTICS_CONFIG.googleAnalytics,
        yandexId: ANALYTICS_CONFIG.yandexMetrika?.id,
        gaId: ANALYTICS_CONFIG.googleAnalytics?.measurementId,
      });
    }
  }, [shouldShowConsent]);

  // Если consent не требуется, сразу разрешаем аналитику
  // Хук должен вызываться безусловно (правило React Hooks)
  useEffect(() => {
    if (
      !shouldShowConsent &&
      (ANALYTICS_CONFIG.yandexMetrika || ANALYTICS_CONFIG.googleAnalytics)
    ) {
      setConsent(true);
    }
  }, [shouldShowConsent, setConsent]);

  // ИСПРАВЛЕНИЕ: Мемоизируем callback для предотвращения бесконечных рендеров
  const handleConsentChange = useCallback(
    (preferences: CookieConsentPreferences) => {
      // Разрешаем загрузку аналитики, если пользователь согласился
      setConsent(preferences.analytics);

      if (ANALYTICS_CONFIG.debug) {
        console.log('🍪 Cookie Consent Updated:', preferences);
      }
    },
    [setConsent],
  );

  if (!shouldShowConsent) {
    return null;
  }

  return <CookieConsent onConsentChange={handleConsentChange} />;
}
