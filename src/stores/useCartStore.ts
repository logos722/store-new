// src/stores/useCartStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Product } from '@/types/product';

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  // selectors
  totalItems: () => number;
  totalPrice: () => number;
  // actions
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  getCart: () => CartItem[];
  getQuantity: (productId: string) => number;
}

// Persist to localStorage under key "nextjs-cart"
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      getCart: () => get().items,

      getQuantity: (productId: string) =>
        get().items.find(i => i.id === productId)?.quantity ?? 0,

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      addItem: (item, qty = 1) => {
        try {
          set(state => {
            const exists = state.items.find(i => i.id === item.id);
            if (exists) {
              return {
                items: state.items.map(i =>
                  i.id === item.id ? { ...i, quantity: i.quantity + qty } : i,
                ),
              };
            }
            const newItem = { ...item, quantity: qty } as CartItem;
            return { items: [...state.items, newItem] };
          });
        } catch (e) {
          console.error('Failed to add item to cart:', e);
        }
      },

      removeItem: id =>
        set(state => ({
          items: state.items.filter(i => i.id !== id),
        })),

      updateQuantity: (id, qty) => {
        if (qty <= 0) {
          // remove if zero or negative
          get().removeItem(id);
        } else {
          set(state => ({
            items: state.items.map(i =>
              i.id === id ? { ...i, quantity: qty } : i,
            ),
          }));
        }
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ items: state.items }),
    },
  ),
);

// Usage in a component:
// const { items, addItem, totalItems } = useCartStore(
//   (s) => ({ items: s.items, addItem: s.addItem, totalItems: s.totalItems }),
//   shallow
// );
