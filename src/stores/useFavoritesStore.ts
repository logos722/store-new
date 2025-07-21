import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface FavoritesState {
  ids: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  favoriteQuenty: () => number;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],

      addFavorite: id =>
        set(state =>
          state.ids.includes(id) ? state : { ids: [...state.ids, id] },
        ),

      removeFavorite: id =>
        set(state => ({
          ids: state.ids.filter(fid => fid !== id),
        })),

      toggleFavorite: id =>
        get().isFavorite(id) ? get().removeFavorite(id) : get().addFavorite(id),

      isFavorite: id => get().ids.includes(id),

      favoriteQuenty: () => get().ids.length,

      clearFavorites: () => set({ ids: [] }),
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
