'use client';

/**
 * Cookie Consent Banner
 *
 * Компонент для управления согласием пользователя на использование куки.
 * Соответствует GDPR и другим требованиям по приватности.
 *
 * Особенности:
 * - Сохраняет выбор пользователя в localStorage
 * - Позволяет принять или отклонить куки
 * - Поддерживает настройку отдельных категорий куки
 * - Минимальный дизайн, не мешающий пользователю
 */

import React, { useState, useEffect } from 'react';
import styles from './CookieConsent.module.scss';

export interface CookieConsentPreferences {
  necessary: boolean; // Всегда true (необходимые куки)
  analytics: boolean; // Яндекс.Метрика, Google Analytics
  marketing: boolean; // Будущие маркетинговые куки (пока не используется)
}

interface CookieConsentProps {
  /**
   * Callback при изменении настроек куки
   */
  onConsentChange?: (preferences: CookieConsentPreferences) => void;

  /**
   * Автоматически принимать куки через N секунд (если не указано, не принимает)
   */
  autoAcceptAfter?: number;
}

const STORAGE_KEY = 'cookie-consent';
const CONSENT_VERSION = '1'; // Увеличивайте при изменении политики

/**
 * Получить сохраненные предпочтения из localStorage
 */
function getStoredConsent(): CookieConsentPreferences | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    // Проверяем версию согласия
    if (parsed.version !== CONSENT_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed.preferences;
  } catch (error) {
    console.error('Error reading cookie consent:', error);
    return null;
  }
}

/**
 * Сохранить предпочтения в localStorage
 */
function saveConsent(preferences: CookieConsentPreferences) {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: CONSENT_VERSION,
        preferences,
        timestamp: new Date().toISOString(),
      }),
    );
  } catch (error) {
    console.error('Error saving cookie consent:', error);
  }
}

export function CookieConsent({
  onConsentChange,
  autoAcceptAfter,
}: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookieConsentPreferences>({
    necessary: true,
    analytics: true,
    marketing: false,
  });

  // Проверяем сохраненное согласие при монтировании
  useEffect(() => {
    const stored = getStoredConsent();

    if (stored) {
      // Согласие уже дано
      setIsVisible(false);
      onConsentChange?.(stored);
    } else {
      // Показываем баннер
      setIsVisible(true);
    }
  }, [onConsentChange]);

  // Автоматическое принятие через N секунд
  useEffect(() => {
    if (!isVisible || !autoAcceptAfter) return;

    const timer = setTimeout(() => {
      handleAcceptAll();
    }, autoAcceptAfter * 1000);

    return () => clearTimeout(timer);
    // handleAcceptAll стабильна и не изменяется, поэтому не добавляем в зависимости
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, autoAcceptAfter]);

  /**
   * Принять все куки
   */
  const handleAcceptAll = () => {
    const allAccepted: CookieConsentPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };

    saveConsent(allAccepted);
    onConsentChange?.(allAccepted);
    setIsVisible(false);
  };

  /**
   * Принять только необходимые куки
   */
  const handleAcceptNecessary = () => {
    const necessaryOnly: CookieConsentPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };

    saveConsent(necessaryOnly);
    onConsentChange?.(necessaryOnly);
    setIsVisible(false);
  };

  /**
   * Сохранить пользовательские настройки
   */
  const handleSavePreferences = () => {
    saveConsent(preferences);
    onConsentChange?.(preferences);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.banner} role="dialog" aria-label="Cookie consent">
        <div className={styles.content}>
          <h3 className={styles.title}>🍪 Мы используем куки</h3>

          {!showDetails ? (
            <>
              <p className={styles.description}>
                Мы используем куки для улучшения работы сайта и анализа
                посещаемости. Ваши данные обрабатываются в соответствии с
                политикой конфиденциальности.
              </p>

              <div className={styles.actions}>
                <button
                  className={`${styles.button} ${styles.buttonPrimary}`}
                  onClick={handleAcceptAll}
                  type="button"
                >
                  Принять все
                </button>

                <button
                  className={`${styles.button} ${styles.buttonSecondary}`}
                  onClick={handleAcceptNecessary}
                  type="button"
                >
                  Только необходимые
                </button>

                <button
                  className={`${styles.button} ${styles.buttonText}`}
                  onClick={() => setShowDetails(true)}
                  type="button"
                >
                  Настроить
                </button>
              </div>
            </>
          ) : (
            <>
              <p className={styles.description}>
                Выберите, какие куки вы хотите разрешить:
              </p>

              <div className={styles.preferences}>
                <label className={styles.preference}>
                  <input
                    type="checkbox"
                    checked={preferences.necessary}
                    disabled
                    className={styles.checkbox}
                  />
                  <div className={styles.preferenceInfo}>
                    <strong>Необходимые</strong>
                    <span className={styles.preferenceDescription}>
                      Требуются для работы сайта (корзина, сессия)
                    </span>
                  </div>
                </label>

                <label className={styles.preference}>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={e =>
                      setPreferences(prev => ({
                        ...prev,
                        analytics: e.target.checked,
                      }))
                    }
                    className={styles.checkbox}
                  />
                  <div className={styles.preferenceInfo}>
                    <strong>Аналитика</strong>
                    <span className={styles.preferenceDescription}>
                      Яндекс.Метрика, Google Analytics для улучшения сайта
                    </span>
                  </div>
                </label>

                <label className={styles.preference}>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={e =>
                      setPreferences(prev => ({
                        ...prev,
                        marketing: e.target.checked,
                      }))
                    }
                    className={styles.checkbox}
                  />
                  <div className={styles.preferenceInfo}>
                    <strong>Маркетинг</strong>
                    <span className={styles.preferenceDescription}>
                      Персонализированная реклама (пока не используется)
                    </span>
                  </div>
                </label>
              </div>

              <div className={styles.actions}>
                <button
                  className={`${styles.button} ${styles.buttonPrimary}`}
                  onClick={handleSavePreferences}
                  type="button"
                >
                  Сохранить
                </button>

                <button
                  className={`${styles.button} ${styles.buttonText}`}
                  onClick={() => setShowDetails(false)}
                  type="button"
                >
                  Назад
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
