// hooks/useFilters.ts
import { useReducer, useCallback } from 'react';
import { useDebounce } from '@/components/header/hooks/useDebounce';
import { SortOption } from '@/types/catalog';

/**
 * Internal state shape for your filters.
 */
interface FilterState {
  selectedCategories: string[];
  priceRange: { min: number; max: number };
  inStock: boolean;
  sort: SortOption;
}

/**
 * Actions for updating the filters.
 */
type FilterAction =
  | { type: 'SET_CATEGORIES'; payload: string[] }
  | { type: 'SET_PRICE_RANGE'; payload: { min: number; max: number } }
  | { type: 'SET_IN_STOCK'; payload: boolean }
  | { type: 'SET_SORT'; payload: SortOption };

/**
 * Default values — change in one place if your business rules evolve.
 */
const INITIAL_STATE: FilterState = {
  selectedCategories: [],
  priceRange: { min: 0, max: 100_000 },
  inStock: false,
  sort: 'name-asc',
};

/**
 * Ensures priceRange is always valid (non‑negative, min ≤ max).
 */
function filtersReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_CATEGORIES':
      return { ...state, selectedCategories: action.payload };

    case 'SET_PRICE_RANGE': {
      let { min, max } = action.payload;
      // clamp negatives to zero
      min = Math.max(0, min);
      max = Math.max(0, max);
      // swap if user accidentally inverts
      if (min > max) [min, max] = [max, min];
      return { ...state, priceRange: { min, max } };
    }

    case 'SET_IN_STOCK':
      return { ...state, inStock: action.payload };

    case 'SET_SORT':
      return { ...state, sort: action.payload };

    default:
      // should never happen if your types are correct
      return state;
  }
}

/**
 * Hook that:
 * 1. Manages raw filter state via useReducer
 * 2. Exposes debounced versions of each filter to drive queries
 * 3. Returns stable callbacks for your component to dispatch updates
 */
export function useFilters(debounceMs = 300) {
  const [state, dispatch] = useReducer(filtersReducer, INITIAL_STATE);

  // debounce each slice of state to avoid rapid-fire queries
  const debouncedCategories = useDebounce(state.selectedCategories, debounceMs);
  const debouncedPriceRange = useDebounce(state.priceRange, debounceMs);
  const debouncedInStock = useDebounce(state.inStock, debounceMs);
  const debouncedSort = useDebounce(state.sort, debounceMs);

  // stable callbacks so you can pass them directly into children
  const setSelectedCategories = useCallback(
    (cats: string[]) => dispatch({ type: 'SET_CATEGORIES', payload: cats }),
    [],
  );

  const setPriceRange = useCallback(
    (min: number, max: number) =>
      dispatch({ type: 'SET_PRICE_RANGE', payload: { min, max } }),
    [],
  );

  const setInStock = useCallback(
    (inStock: boolean) => dispatch({ type: 'SET_IN_STOCK', payload: inStock }),
    [],
  );

  const setSort = useCallback(
    (sortOption: SortOption) =>
      dispatch({ type: 'SET_SORT', payload: sortOption }),
    [],
  );

  return {
    // raw values for your UI controls
    filters: state,

    // debounced values for your React Query key
    debouncedFilters: {
      selectedCategories: debouncedCategories,
      priceRange: debouncedPriceRange,
      inStock: debouncedInStock,
      sort: debouncedSort,
    },

    // updater functions
    setSelectedCategories,
    setPriceRange,
    setInStock,
    setSort,
  };
}
