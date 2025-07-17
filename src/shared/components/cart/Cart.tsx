'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa';
import CartItem from './CartItem';
import styles from './Cart.module.scss';
import { useCart } from '@/context/cart';

const Cart: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const { cart, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={styles.cartContainer} ref={cartRef}>
      <button className={styles.cartLink} onClick={() => setIsOpen(!isOpen)}>
        <FaShoppingCart className={styles.icon} />
        {totalItems > 0 && (
          <span className={styles.badge}>
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={styles.cartDropdown}>
          {cart.items.length === 0 ? (
            <p className={styles.emptyCart}>Корзина пуста</p>
          ) : (
            <>
              <div className={styles.cartItems}>
                {cart.items.map(item => (
                  <CartItem
                    key={item.product.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>
              <div className={styles.cartFooter}>
                <div className={styles.total}>
                  Итого: <span>{cart.total} ₽</span>
                </div>
                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className={styles.checkoutButton}
                >
                  Оформить заказ
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
