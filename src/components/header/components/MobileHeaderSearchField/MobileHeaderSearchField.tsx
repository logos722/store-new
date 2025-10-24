'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SearchCategory, SearchResult } from '@/types/search';
import styles from './MobileHeaderSearchField.module.scss';
import { useDebounce } from '../../hooks/useDebounce';
import { Product } from '@/types/product';
import { FaSearch, FaTimes } from 'react-icons/fa';

const categories: SearchCategory[] = [{ id: 'pvc', name: 'ПВХ', slug: 'PVC' }];

type SearchItem = Product | SearchCategory;

interface MobileHeaderSearchFieldProps {
  onExpandChange?: (isExpanded: boolean) => void; // колбэк для сообщения родителю об изменении состояния
}

/**
 * Мобильная версия поля поиска с анимированным расширением
 * При клике на иконку лупы расширяется, занимая больше места в grid
 */
const MobileHeaderSearchField: React.FC<MobileHeaderSearchFieldProps> = ({
  onExpandChange,
}) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [results, setResults] = useState<SearchResult>({
    products: [],
    categories: [],
  });
  const [isExpanded, setIsExpanded] = useState(false); // состояние расширения поля поиска
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // ✅ Эффект для фокуса на input при расширении
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // ✅ Уведомляем родителя об изменении состояния расширения
  useEffect(() => {
    if (onExpandChange) {
      onExpandChange(isExpanded);
    }
  }, [isExpanded, onExpandChange]);

  // ✅ Закрываем выпадающий список при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        // Если поле пустое, сворачиваем поиск при клике вне компонента
        if (!query.trim()) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [query]);

  // ✅ Поиск по категориям на фронтенде
  const searchCategories = (searchQuery: string): SearchCategory[] => {
    if (!searchQuery) return [];
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  // ✅ Поиск по продуктам через API с обработкой ошибок
  const searchProducts = async (searchQuery: string): Promise<Product[]> => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `/api/search?query=${encodeURIComponent(searchQuery)}`,
      );
      if (!res.ok) {
        console.error('Search API error', res.status);
        return [];
      }
      const data: { query: string; results: Product[] } = await res.json();

      return data.results || [];
    } catch (error) {
      console.error('Ошибка при поиске продуктов:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Поиск при изменении debouncedQuery
  useEffect(() => {
    const q = debouncedQuery.trim();
    if (!q) {
      setResults({ products: [], categories: [] });
      setIsOpen(false);
      return;
    }

    setIsOpen(true);
    (async () => {
      const products = await searchProducts(q);
      const cats = searchCategories(q);
      setResults({ products, categories: cats });
    })();
  }, [debouncedQuery]);

  // ✅ Обработчик выбора результата
  const handleSelect = (type: 'product' | 'category', item: SearchItem) => {
    if (type === 'product') {
      router.push(`/product/${item.slug}`);
    } else {
      router.push(`/catalog/${item.slug}`);
    }
    setIsOpen(false);
    setQuery('');
    setIsExpanded(false); // Сворачиваем после выбора
  };

  // ✅ Обработчик клика на иконку поиска
  const handleSearchIconClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    } else if (query.trim()) {
      // Если поле развернуто и есть текст, можно выполнить поиск
      // или перейти на страницу результатов поиска
      router.push(`/catalog?search=${encodeURIComponent(query)}`);
    }
  };

  // ✅ Обработчик клика на кнопку закрытия
  const handleCloseClick = () => {
    setQuery('');
    setIsExpanded(false);
    setIsOpen(false);
  };

  // ✅ Обработчик нажатия клавиши Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCloseClick();
      }
    };

    if (isExpanded) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isExpanded]);

  return (
    <div
      className={`${styles.searchContainer} ${isExpanded ? styles.expanded : ''}`}
      ref={searchRef}
    >
      {/* Иконка поиска - всегда видна */}
      {!isExpanded && (
        <button
          className={styles.searchIconBtn}
          onClick={handleSearchIconClick}
          aria-label="Открыть поиск"
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleSearchIconClick();
            }
          }}
        >
          <FaSearch aria-hidden="true" />
        </button>
      )}

      {/* Поле ввода - показывается при расширении */}
      {isExpanded && (
        <div className={styles.searchInputWrapper}>
          <FaSearch className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Поиск..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => {
              if (debouncedQuery) setIsOpen(true);
            }}
            className={styles.searchInput}
          />
          <button
            className={styles.closeBtn}
            onClick={handleCloseClick}
            aria-label="Закрыть поиск"
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCloseClick();
              }
            }}
          >
            <FaTimes aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Результаты поиска */}
      {isOpen && isExpanded && (query || isLoading) && (
        <div className={styles.searchResults}>
          {isLoading ? (
            <div className={styles.loading}>Поиск...</div>
          ) : (
            <>
              {results.categories?.length > 0 && (
                <div className={styles.resultsSection}>
                  <h3>Категории</h3>
                  {results.categories.map(category => (
                    <div
                      key={category.id}
                      className={styles.resultItem}
                      onClick={() => handleSelect('category', category)}
                    >
                      {category.name}
                    </div>
                  ))}
                </div>
              )}

              {results.products?.length > 0 && (
                <div className={styles.resultsSection}>
                  <h3>Товары</h3>
                  {results.products.map(product => (
                    <div
                      key={product.id}
                      className={styles.resultItem}
                      onClick={() => handleSelect('product', product)}
                    >
                      {product.name}
                    </div>
                  ))}
                </div>
              )}

              {!isLoading &&
                results.products.length === 0 &&
                results.categories.length === 0 && (
                  <div className={styles.noResults}>Ничего не найдено</div>
                )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileHeaderSearchField;
