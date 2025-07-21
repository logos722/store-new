'use client';
import React, { useState } from 'react';
import Container from '@/shared/components/container/Container';
import CartItem from '@/shared/components/cart/CartItem';
import OrderModal from '@/shared/components/orderModal/OrderModal';
import styles from './CartPage.module.scss';
import Link from 'next/link';
import { OrderFormData } from '@/types/order';
import { useCartStore } from '@/store/useCartStore';
import { Product } from '@/types/product';
interface OrderPayload {
  items: Array<Product>;
  total: number;
  customerInfo: {
    email: string;
    name: string;
    phone: string;
    city: string;
    comment?: string;
  };
}

const CartPage = () => {
  const cartItems = useCartStore(s => s.getCart());
  const totalItems = useCartStore(s => s.totalItems());
  const totalPrice = useCartStore(s => s.totalPrice());
  const updateQuantity = useCartStore(s => s.updateQuantity);
  const removeItem = useCartStore(s => s.removeItem);
  const clearCart = useCartStore(s => s.clearCart);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const handleOrderSubmit = async (formData: OrderFormData) => {
    const payload: OrderPayload = {
      items: cartItems, // из контекста корзины
      total: totalItems, // из контекста корзины
      customerInfo: formData,
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to submit order');

      clearCart();
      alert('Заказ успешно оформлен!');
    } catch (err) {
      console.error('Error submitting order:', err);
      alert('Ошибка при оформлении заказа, попробуйте ещё раз.');
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
                onClick={() => setIsOrderModalOpen(true)}
              >
                Оформить заказ
              </button>
            </div>
          </>
        )}
      </div>

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onSubmit={handleOrderSubmit}
      />
    </Container>
  );
};

export default CartPage;
