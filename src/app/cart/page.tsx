'use client';
import React, { useState } from 'react';
import Container from '@/shared/components/container/Container';
import CartItem from '@/shared/components/cart/CartItem';
import OrderModal from '@/shared/components/orderModal/OrderModal';
import styles from './CartPage.module.scss';
import { useCart } from '@/context/cart';
import Link from 'next/link';
import { OrderFormData } from '@/types/order';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const handleOrderSubmit = async (formData: OrderFormData) => {
    try {
      // Здесь будет логика отправки заказа на сервер
      console.log('Order submitted:', {
        items: cart.items,
        total: cart.total,
        customerInfo: formData
      });
      
      // В реальном приложении здесь будет API-запрос
      // const response = await fetch('/api/orders', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     items: cart.items,
      //     total: cart.total,
      //     customerInfo: formData
      //   }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to submit order');
      // }
      
      // Очищаем корзину после успешного оформления заказа
      clearCart();
      
      // Закрываем модальное окно
      setIsOrderModalOpen(false);
      
      // Показываем сообщение об успехе
      alert('Заказ успешно оформлен!');
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.');
    }
  };

  return (
    <Container>
      <div className={styles.cartPage}>
        <h1>Корзина</h1>
        
        {cart.items.length === 0 ? (
          <div className={styles.emptyCart}>
            <p>Ваша корзина пуста</p>
            <Link href="/catalog" className={styles.continueShopping}>
              Продолжить покупки
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.cartItems}>
              {cart.items.map((item) => (
                <CartItem
                  key={item.product.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </div>
            
            <div className={styles.cartSummary}>
              <div className={styles.summaryItem}>
                <span>Товаров в корзине:</span>
                <span>
                  {cart.items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span>Итого:</span>
                <span className={styles.total}>{cart.total} ₽</span>
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
