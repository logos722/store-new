'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { OrderFormData } from '@/types/order';
import styles from './OrderModal.module.scss';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';
import {
  applyPhoneMask,
  getPhoneDigits,
  isValidRussianPhone,
} from '@/shared/utils/phoneMask';
import {
  validateEmail,
  validateName,
  normalizeEmail,
} from '@/shared/utils/validation';
import { filterCities, City } from '@/constants/russianCities';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: OrderFormData) => void;
}

const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const cartItem = useCartStore(s => s.getCart());
  const totalPrice = useCartStore(s => s.totalPrice());

  const [formData, setFormData] = useState<OrderFormData>({
    email: '',
    name: '',
    phone: '',
    city: '',
    comment: '',
    privacyConsent: false, // По умолчанию не согласен - безопасный подход
  });

  // Состояние для отображения ошибок валидации каждого поля
  const [errors, setErrors] = useState<{
    email?: string;
    name?: string;
    phone?: string;
    city?: string;
    consent?: string;
  }>({});

  // Состояние для автокомплита городов
  const [citySuggestions, setCitySuggestions] = useState<City[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  // Refs для управления автокомплитом
  const cityInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Таймер для debounce поиска городов
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Обработчик отправки формы с полной валидацией всех полей
   * Проверяет согласие, валидность email, телефона, имени и города
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    // Валидация согласия на обработку персональных данных
    if (!formData.privacyConsent) {
      newErrors.consent =
        'Необходимо согласие на обработку персональных данных';
    }

    // Валидация имени
    const nameValidation = validateName(formData.name);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.error;
    }

    // Валидация email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.error;
    }

    // Валидация телефона
    if (!formData.phone || formData.phone.trim().length === 0) {
      newErrors.phone = 'Телефон обязателен для заполнения';
    } else if (!isValidRussianPhone(formData.phone)) {
      newErrors.phone = 'Введите корректный российский номер телефона';
    }

    // Валидация города
    if (!formData.city || formData.city.trim().length === 0) {
      newErrors.city = 'Город обязателен для заполнения';
    } else if (formData.city.trim().length < 2) {
      newErrors.city = 'Название города должно содержать минимум 2 символа';
    }

    // Если есть ошибки, обновляем состояние и прерываем отправку
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      // Фокусируемся на первом поле с ошибкой для улучшения UX
      const firstErrorField = Object.keys(newErrors)[0];
      const fieldElement = document.getElementById(firstErrorField);
      if (fieldElement) {
        fieldElement.focus();
      }

      return;
    }

    // Сбрасываем ошибки при успешной валидации
    setErrors({});

    // Нормализуем данные перед отправкой
    const normalizedData: OrderFormData = {
      ...formData,
      email: normalizeEmail(formData.email),
      phone: getPhoneDigits(formData.phone), // Отправляем только цифры
      name: formData.name.trim(),
      city: formData.city.trim(),
      comment: formData.comment?.trim() || '',
    };

    onSubmit(normalizedData);
  };

  /**
   * Обработчик изменения поля email с валидацией
   * Нормализует email и проверяет валидность при потере фокуса
   */
  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData(prev => ({ ...prev, email: value }));

      // Сбрасываем ошибку при вводе
      if (errors.email) {
        setErrors(prev => ({ ...prev, email: undefined }));
      }
    },
    [errors.email],
  );

  /**
   * Валидация email при потере фокуса
   */
  const handleEmailBlur = useCallback(() => {
    if (formData.email) {
      const validation = validateEmail(formData.email);
      if (!validation.isValid) {
        setErrors(prev => ({ ...prev, email: validation.error }));
      }
    }
  }, [formData.email]);

  /**
   * Обработчик изменения поля имени с валидацией
   */
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData(prev => ({ ...prev, name: value }));

      // Сбрасываем ошибку при вводе
      if (errors.name) {
        setErrors(prev => ({ ...prev, name: undefined }));
      }
    },
    [errors.name],
  );

  /**
   * Валидация имени при потере фокуса
   */
  const handleNameBlur = useCallback(() => {
    if (formData.name) {
      const validation = validateName(formData.name);
      if (!validation.isValid) {
        setErrors(prev => ({ ...prev, name: validation.error }));
      }
    }
  }, [formData.name]);

  /**
   * Обработчик изменения поля телефона с применением маски
   * Автоматически форматирует номер в российский формат +7 (XXX) XXX-XX-XX
   */
  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const maskedValue = applyPhoneMask(value);

      setFormData(prev => ({ ...prev, phone: maskedValue }));

      // Сбрасываем ошибку при вводе
      if (errors.phone) {
        setErrors(prev => ({ ...prev, phone: undefined }));
      }
    },
    [errors.phone],
  );

  /**
   * Валидация телефона при потере фокуса
   */
  const handlePhoneBlur = useCallback(() => {
    if (formData.phone) {
      if (!isValidRussianPhone(formData.phone)) {
        setErrors(prev => ({
          ...prev,
          phone: 'Введите корректный российский номер телефона',
        }));
      }
    }
  }, [formData.phone]);

  /**
   * Обработчик изменения поля города с поиском и автокомплитом
   * Использует debounce для оптимизации производительности
   */
  const handleCityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData(prev => ({ ...prev, city: value }));

      // Сбрасываем ошибку при вводе
      if (errors.city) {
        setErrors(prev => ({ ...prev, city: undefined }));
      }

      // Очищаем предыдущий таймер
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }

      // Debounce поиска городов (300ms задержка)
      searchTimerRef.current = setTimeout(() => {
        if (value.trim().length >= 2) {
          const suggestions = filterCities(value, 10);
          setCitySuggestions(suggestions);
          setShowCitySuggestions(suggestions.length > 0);
        } else {
          setCitySuggestions([]);
          setShowCitySuggestions(false);
        }
      }, 300);
    },
    [errors.city],
  );

  /**
   * Обработчик выбора города из списка автокомплита
   */
  const handleCitySelect = useCallback(
    (city: City) => {
      setFormData(prev => ({ ...prev, city: city.name }));
      setCitySuggestions([]);
      setShowCitySuggestions(false);

      // Сбрасываем ошибку при выборе
      if (errors.city) {
        setErrors(prev => ({ ...prev, city: undefined }));
      }
    },
    [errors.city],
  );

  /**
   * Обработчик фокуса на поле города
   */
  const handleCityFocus = useCallback(() => {
    // Если есть текущее значение и есть подсказки, показываем их
    if (formData.city.trim().length >= 2 && citySuggestions.length > 0) {
      setShowCitySuggestions(true);
    }
  }, [formData.city, citySuggestions.length]);

  /**
   * Обработчик потери фокуса на поле города
   * Закрывает список автокомплита с небольшой задержкой для обработки клика
   */
  const handleCityBlur = useCallback(() => {
    // Задержка для обработки клика по подсказке
    setTimeout(() => {
      setShowCitySuggestions(false);
    }, 200);
  }, []);

  /**
   * Обработчик изменения комментария
   */
  const handleCommentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setFormData(prev => ({ ...prev, comment: value }));
    },
    [],
  );

  /**
   * Обработчик изменения чекбокса согласия
   * При установке чекбокса сбрасывает ошибку валидации
   */
  const handleConsentChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      setFormData(prev => ({
        ...prev,
        privacyConsent: checked,
      }));

      // Сбрасываем ошибку, если пользователь согласился
      if (checked && errors.consent) {
        setErrors(prev => ({ ...prev, consent: undefined }));
      }
    },
    [errors.consent],
  );

  /**
   * Очистка таймеров при размонтировании компонента или закрытии модалки
   * Предотвращает утечки памяти
   */
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  /**
   * Сброс формы при закрытии модального окна
   */
  useEffect(() => {
    if (!isOpen) {
      // Сбрасываем форму и ошибки
      setFormData({
        email: '',
        name: '',
        phone: '',
        city: '',
        comment: '',
        privacyConsent: false,
      });
      setErrors({});
      setCitySuggestions([]);
      setShowCitySuggestions(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Определяем, должны ли поля быть заблокированы
  // Блокируем поля, если пользователь не согласился с политикой
  const isFieldsDisabled = !formData.privacyConsent;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Закрыть модальное окно"
        >
          ×
        </button>

        <h2>Оформление заказа</h2>

        <div className={styles.orderSummary}>
          <h3>Ваш заказ</h3>
          <div className={styles.itemsList}>
            {cartItem.map(item => (
              <div key={item.id} className={styles.orderItem}>
                <span>{item.name}</span>
                <span>
                  {item.quantity} × {item.price.toFixed(2)} ₽
                </span>
              </div>
            ))}
          </div>
          <div className={styles.total}>
            <span>Итого:</span>
            <span>{totalPrice.toFixed(2)} ₽</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.orderForm}>
          {/* Чекбокс согласия - всегда активен и находится в начале формы */}
          <div
            className={`${styles.consentGroup} ${errors.consent ? styles.consentError : ''}`}
          >
            <label htmlFor="privacyConsent" className={styles.consentLabel}>
              <input
                type="checkbox"
                id="privacyConsent"
                name="privacyConsent"
                checked={formData.privacyConsent}
                onChange={handleConsentChange}
                className={styles.consentCheckbox}
                aria-required="true"
                aria-invalid={!!errors.consent}
                aria-describedby={errors.consent ? 'consent-error' : undefined}
              />
              <span className={styles.consentText}>
                Я согласен с{' '}
                <Link
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.privacyLink}
                  onClick={e => e.stopPropagation()}
                >
                  политикой обработки персональных данных
                </Link>{' '}
                *
              </span>
            </label>
            {errors.consent && (
              <span
                id="consent-error"
                className={styles.errorMessage}
                role="alert"
              >
                {errors.consent}
              </span>
            )}
          </div>

          {/* Разделитель для визуального отделения */}
          <div className={styles.formDivider} />

          {/* Поле Email с валидацией */}
          <div className={styles.formGroup}>
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              disabled={isFieldsDisabled}
              required
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={`${isFieldsDisabled ? styles.disabledField : ''} ${errors.email ? styles.fieldError : ''}`}
              placeholder="example@mail.ru"
              autoComplete="email"
            />
            {errors.email && (
              <span
                id="email-error"
                className={styles.fieldErrorMessage}
                role="alert"
              >
                {errors.email}
              </span>
            )}
          </div>

          {/* Поле Имя с валидацией */}
          <div className={styles.formGroup}>
            <label htmlFor="name">Имя *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              disabled={isFieldsDisabled}
              required
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
              className={`${isFieldsDisabled ? styles.disabledField : ''} ${errors.name ? styles.fieldError : ''}`}
              placeholder="Иван Иванов"
              autoComplete="name"
            />
            {errors.name && (
              <span
                id="name-error"
                className={styles.fieldErrorMessage}
                role="alert"
              >
                {errors.name}
              </span>
            )}
          </div>

          {/* Поле Телефон с маской */}
          <div className={styles.formGroup}>
            <label htmlFor="phone">Телефон *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              onBlur={handlePhoneBlur}
              disabled={isFieldsDisabled}
              required
              aria-required="true"
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              className={`${isFieldsDisabled ? styles.disabledField : ''} ${errors.phone ? styles.fieldError : ''}`}
              placeholder="+7 (___) ___-__-__"
              autoComplete="tel"
            />
            {errors.phone && (
              <span
                id="phone-error"
                className={styles.fieldErrorMessage}
                role="alert"
              >
                {errors.phone}
              </span>
            )}
          </div>

          {/* Поле Город с автокомплитом */}
          <div className={styles.formGroup}>
            <label htmlFor="city">Город *</label>
            <div className={styles.autocompleteWrapper}>
              <input
                type="text"
                id="city"
                name="city"
                ref={cityInputRef}
                value={formData.city}
                onChange={handleCityChange}
                onFocus={handleCityFocus}
                onBlur={handleCityBlur}
                disabled={isFieldsDisabled}
                required
                aria-required="true"
                aria-invalid={!!errors.city}
                aria-describedby={errors.city ? 'city-error' : undefined}
                aria-autocomplete="list"
                aria-controls="city-suggestions"
                className={`${isFieldsDisabled ? styles.disabledField : ''} ${errors.city ? styles.fieldError : ''}`}
                placeholder="Начните вводить название города"
                autoComplete="off"
              />

              {/* Список автокомплита городов */}
              {showCitySuggestions && citySuggestions.length > 0 && (
                <div
                  id="city-suggestions"
                  ref={suggestionsRef}
                  className={styles.suggestionsList}
                  role="listbox"
                >
                  {citySuggestions.map((city, index) => (
                    <div
                      key={`${city.name}-${index}`}
                      className={styles.suggestionItem}
                      role="option"
                      aria-selected={false}
                      onClick={() => handleCitySelect(city)}
                      onMouseDown={e => e.preventDefault()} // Предотвращаем blur перед click
                    >
                      <div className={styles.cityName}>{city.name}</div>
                      <div className={styles.cityRegion}>{city.region}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.city && (
              <span
                id="city-error"
                className={styles.fieldErrorMessage}
                role="alert"
              >
                {errors.city}
              </span>
            )}
          </div>

          {/* Поле Комментарий */}
          <div className={styles.formGroup}>
            <label htmlFor="comment">Комментарий к заказу</label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleCommentChange}
              disabled={isFieldsDisabled}
              rows={4}
              className={isFieldsDisabled ? styles.disabledField : ''}
              placeholder="Дополнительная информация о заказе"
              maxLength={500}
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isFieldsDisabled}
            aria-disabled={isFieldsDisabled}
          >
            Подтвердить заказ
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;
