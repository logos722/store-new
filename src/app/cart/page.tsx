'use client';
import React from 'react';
import Container from '@/shared/components/container/Container';
import CartItem from '@/shared/components/cart/CartItem';
import styles from './CartPage.module.scss';
import { useCart } from '@/context/cart';
import Link from 'next/link';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();

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
              <button className={styles.checkoutButton}>
                Оформить заказ
              </button>
            </div>
          </>
        )}
      </div>
    </Container>
  );
};

export default CartPage;
