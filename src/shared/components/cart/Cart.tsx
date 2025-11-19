'use client';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa';
import CartItem from './CartItem';
import styles from './Cart.module.scss';
import { useCartStore } from '@/stores/useCartStore';

const Cart: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

  const cartItems = useCartStore(s => s.getCart());
  const totalItems = useCartStore(s => s.totalItems());
  const totalPrice = useCartStore(s => s.totalPrice());
  const updateQuantity = useCartStore(s => s.updateQuantity);
  const removeItem = useCartStore(s => s.removeItem);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.cartContainer} ref={cartRef}>
      <button
        aria-label="Открыть корзину"
        className={styles.cartLink}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaShoppingCart className={styles.icon} />
        {isMounted && totalItems > 0 && (
          <span className={styles.badge}>
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={styles.cartDropdown}>
          {cartItems.length === 0 ? (
            <p className={styles.emptyCart}>Корзина пуста</p>
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
              <div className={styles.cartFooter}>
                <div className={styles.total}>
                  Итого: <span>{totalPrice} ₽</span>
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
