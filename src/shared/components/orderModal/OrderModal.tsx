'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/cart';
import { OrderFormData } from '@/types/order';
import styles from './OrderModal.module.scss';

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
  const { cart } = useCart();
  const [formData, setFormData] = useState<OrderFormData>({
    email: '',
    name: '',
    phone: '',
    city: '',
    comment: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <h2>Оформление заказа</h2>

        <div className={styles.orderSummary}>
          <h3>Ваш заказ</h3>
          <div className={styles.itemsList}>
            {cart.items.map(item => (
              <div key={item.product.id} className={styles.orderItem}>
                <span>{item.product.name}</span>
                <span>
                  {item.quantity} × {item.product.price.toFixed(2)} ₽
                </span>
              </div>
            ))}
          </div>
          <div className={styles.total}>
            <span>Итого:</span>
            <span>{cart.total.toFixed(2)} ₽</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.orderForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
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
              required
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
              required
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
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="comment">Комментарий к заказу</label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Подтвердить заказ
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;
