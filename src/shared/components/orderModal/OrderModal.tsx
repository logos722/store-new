'use client';

import React, { useState, useCallback } from 'react';
import { OrderFormData } from '@/types/order';
import styles from './OrderModal.module.scss';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';

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

  // Состояние для отображения ошибки валидации чекбокса
  const [consentError, setConsentError] = useState(false);

  /**
   * Обработчик отправки формы с валидацией согласия
   * Проверяет, что пользователь согласился с политикой обработки данных
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация: проверяем согласие на обработку персональных данных
    if (!formData.privacyConsent) {
      setConsentError(true);
      return;
    }

    // Сбрасываем ошибку при успешной отправке
    setConsentError(false);
    onSubmit(formData);
  };

  /**
   * Обработчик изменений текстовых полей
   * Мемоизирован для оптимизации производительности
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
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
      if (checked) {
        setConsentError(false);
      }
    },
    [],
  );

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
            className={`${styles.consentGroup} ${consentError ? styles.consentError : ''}`}
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
                aria-invalid={consentError}
                aria-describedby={consentError ? 'consent-error' : undefined}
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
            {consentError && (
              <span
                id="consent-error"
                className={styles.errorMessage}
                role="alert"
              >
                Необходимо согласие на обработку персональных данных
              </span>
            )}
          </div>

          {/* Разделитель для визуального отделения */}
          <div className={styles.formDivider} />

          <div className={styles.formGroup}>
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isFieldsDisabled}
              required
              aria-required="true"
              className={isFieldsDisabled ? styles.disabledField : ''}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="name">Имя *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isFieldsDisabled}
              required
              aria-required="true"
              className={isFieldsDisabled ? styles.disabledField : ''}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Телефон *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={isFieldsDisabled}
              required
              aria-required="true"
              className={isFieldsDisabled ? styles.disabledField : ''}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="city">Город *</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={isFieldsDisabled}
              required
              aria-required="true"
              className={isFieldsDisabled ? styles.disabledField : ''}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="comment">Комментарий к заказу</label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              disabled={isFieldsDisabled}
              rows={4}
              className={isFieldsDisabled ? styles.disabledField : ''}
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
