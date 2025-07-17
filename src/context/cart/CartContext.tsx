'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, CartState } from '@/types/cart';
import { Product } from '@/types/product';

interface CartContextType {
  cart: CartState;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartState>({ items: [], total: 0 });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Ошибка при загрузке корзины', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const calculateTotal = (items: CartItem[]): number => {
    return items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(
        item => item.product.id === product.id,
      );

      let newItems;

      if (existingItemIndex >= 0) {
        newItems = [...prevCart.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1,
        };
      } else {
        newItems = [...prevCart.items, { product, quantity: 1 }];
      }

      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(
        item => item.product.id !== productId,
      );
      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.product.id === productId ? { ...item, quantity } : item,
      );
      return {
        items: newItems,
        total: calculateTotal(newItems),
      };
    });
  };

  const getQuantity = (productId: string) => {
    const item = cart.items.find(i => i.product.id === productId);
    return item?.quantity ?? 0;
  };

  const clearCart = () => {
    setCart({ items: [], total: 0 });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
