'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@/shared/components/container/Container';
import CartItem from '@/shared/components/cart/CartItem';
import OrderModal from '@/shared/components/orderModal/OrderModal';
import styles from './CartPage.module.scss';
import Link from 'next/link';
import { OrderFormData } from '@/types/order';
import { useCartStore } from '@/stores/useCartStore';
import { Product } from '@/types/product';
import {
  useCartTracking,
  useOrderTracking,
} from '@/hooks/useAnalyticsTracking';
import { useNotification } from '@/hooks/useNotification';
interface OrderPayload {
  items: Array<Product>;
  total: number;
  totalPrice: number;
  customerInfo: {
    email: string;
    name: string;
    phone: string;
    city: string;
    comment?: string;
  };
}

/**
 * Страница корзины
 *
 * Аналитика:
 * - Отслеживает начало оформления заказа (клик на кнопку "Оформить заказ")
 * - Отслеживает успешное завершение заказа
 */
const CartPage = () => {
  const router = useRouter();
  const notification = useNotification();

  const cartItems = useCartStore(s => s.getCart());
  const totalItems = useCartStore(s => s.totalItems());
  const totalPrice = useCartStore(s => s.totalPrice());
  const updateQuantity = useCartStore(s => s.updateQuantity);
  const removeItem = useCartStore(s => s.removeItem);
  const clearCart = useCartStore(s => s.clearCart);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Аналитика
  const { trackBeginCheckout } = useCartTracking();
  const { trackPurchase } = useOrderTracking();

  // Обработчик открытия модального окна оформления заказа
  const handleCheckoutClick = () => {
    setIsOrderModalOpen(true);
    trackBeginCheckout(cartItems);
  };

  /**
   * Обработчик отправки заказа
   * - Показывает состояние загрузки
   * - Отправляет данные заказа на сервер
   * - Отслеживает покупку в аналитике
   * - Показывает уведомление об успехе/ошибке
   * - Закрывает модалку и перенаправляет на главную страницу
   */
  const handleOrderSubmit = async (formData: OrderFormData) => {
    // Предотвращаем повторную отправку
    if (isSubmitting) return;

    setIsSubmitting(true);

    const payload: OrderPayload = {
      items: cartItems,
      total: totalItems,
      totalPrice: totalPrice,
      customerInfo: formData,
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      // Обработка HTTP ошибок
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Ошибка сервера: ${response.status}`,
        );
      }

      const result = await response.json();
      const orderId = result.orderId || `order_${Date.now()}`;

      // Отслеживаем успешную покупку в аналитике
      trackPurchase(orderId, cartItems, {
        currency: 'RUB',
      });

      // Очищаем корзину
      clearCart();

      // Закрываем модалку
      setIsOrderModalOpen(false);

      // Показываем успешное уведомление
      notification.success(
        `Заказ №${orderId} успешно оформлен! Мы свяжемся с вами в ближайшее время.`,
      );

      router.push('/');
    } catch (err) {
      console.error('Error submitting order:', err);

      // Показываем уведомление об ошибке
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Не удалось оформить заказ. Пожалуйста, попробуйте снова.';

      notification.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <div className={styles.cartPage}>
        <h1>Корзина</h1>

        {cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <p>Ваша корзина пуста</p>
            <Link href="/catalog" className={styles.continueShopping}>
              Продолжить покупки
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.cartItems}>
              {cartItems.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            <div className={styles.cartSummary}>
              <div className={styles.summaryItem}>
                <span>Товаров в корзине:</span>
                <span>
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span>Итого:</span>
                <span className={styles.total}>{totalPrice} ₽</span>
              </div>
              <button
                className={styles.checkoutButton}
                onClick={handleCheckoutClick}
              >
                Оформить заказ
              </button>
            </div>
          </>
        )}
      </div>

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => !isSubmitting && setIsOrderModalOpen(false)}
        onSubmit={handleOrderSubmit}
        isSubmitting={isSubmitting}
      />
    </Container>
  );
};

export default CartPage;
