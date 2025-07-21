import { create } from 'zustand';
export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

interface FilterState {
  selectedCategories: string[];
  priceRange: { min: number; max: number };
  inStock: boolean;
  sort: SortOption;
}

interface FilterActions {
  setCategories: (cats: string[]) => void;
  setPriceRange: (min: number, max: number) => void;
  setInStock: (inStock: boolean) => void;
  setSort: (sort: SortOption) => void;
}

interface DebouncedFilters {
  selectedCategories: string[];
  priceRange: { min: number; max: number };
  inStock: boolean;
  sort: SortOption;
}

interface FilterStore extends FilterState, FilterActions {
  /** debounced snapshot for query keys */
  debounced: DebouncedFilters;
}

const INITIAL_STATE: FilterState = {
  selectedCategories: [],
  priceRange: { min: 0, max: 100_000 },
  inStock: false,
  sort: 'name-asc',
};

function createDebounce<Args extends unknown[], R>(
  fn: (...args: Args) => R,
  wait: number,
): (...args: Args) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, wait);
  };
}

export const useFilterStore = create<FilterStore>((set, get) => {
  // create debounced updater
  const updateDebounced = createDebounce(() => {
    const { selectedCategories, priceRange, inStock, sort } = get();
    set({
      debounced: { selectedCategories, priceRange, inStock, sort },
    });
  }, 300);

  // initialize debounced with initial state
  set({ debounced: INITIAL_STATE });

  return {
    ...INITIAL_STATE,

    // actions
    setCategories: cats => {
      set({ selectedCategories: cats }, false);
      updateDebounced();
    },

    setPriceRange: (min, max) => {
      // clamp & swap
      const clampedMin = Math.max(0, min);
      const clampedMax = Math.max(0, max);
      const [finalMin, finalMax] =
        clampedMin <= clampedMax
          ? [clampedMin, clampedMax]
          : [clampedMax, clampedMin];

      set({ priceRange: { min: finalMin, max: finalMax } }, false);
      updateDebounced();
    },

    setInStock: flag => {
      set({ inStock: flag }, false);
      updateDebounced();
    },

    setSort: sort => {
      set({ sort }, false);
      updateDebounced();
    },

    // placeholder; will be overwritten above
    debounced: INITIAL_STATE,
  };
});

/**
 * Usage:
 * const { selectedCategories, setCategories } = useFilterStore(
 *   (s) => ({ selectedCategories: s.selectedCategories, setCategories: s.setCategories }),
 *   shallow
 * );
 *
 * // For query keys:
 * const debounced = useFilterStore((s) => s.debounced);
 */
