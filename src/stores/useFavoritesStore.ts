import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Product } from '@/types/product';

interface FavoriteProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | import('next/image').StaticImageData;
  category: string;
  stock: number;
  quantity: number;
  [key: string]:
    | string
    | number
    | import('next/image').StaticImageData
    | boolean;
}

interface FavoritesState {
  // Массив полных объектов товаров
  products: FavoriteProduct[];
  // Для обратной совместимости - массив ID
  ids: string[];
  addFavorite: (product: Product | FavoriteProduct) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (product: Product | FavoriteProduct) => void;
  isFavorite: (id: string) => boolean;
  favoriteQuenty: () => number;
  clearFavorites: () => void;
  getFavoriteProduct: (id: string) => FavoriteProduct | undefined;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      products: [],
      ids: [],

      addFavorite: product => {
        const state = get();

        if (state.ids.includes(product.id)) {
          return;
        }

        const favoriteProduct: FavoriteProduct = {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image,
          category: product.category,
          stock: product.stock,
          quantity: product.quantity,
        };

        set(state => ({
          products: [...state.products, favoriteProduct],
          ids: [...state.ids, product.id],
        }));
      },

      removeFavorite: id =>
        set(state => ({
          products: state.products.filter(product => product.id !== id),
          ids: state.ids.filter(fid => fid !== id),
        })),

      toggleFavorite: product => {
        const state = get();
        if (state.isFavorite(product.id)) {
          state.removeFavorite(product.id);
        } else {
          state.addFavorite(product);
        }
      },

      isFavorite: id => get().ids.includes(id),

      favoriteQuenty: () => get().ids.length,

      clearFavorites: () => set({ products: [], ids: [] }),

      getFavoriteProduct: id =>
        get().products.find(product => product.id === id),
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// Usage:
// const { ids, toggleFavorite } = useFavoritesStore(
//   (s) => ({ ids: s.ids, toggleFavorite: s.toggleFavorite }),
//   shallow
// );
