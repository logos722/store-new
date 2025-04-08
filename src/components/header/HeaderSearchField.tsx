'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SearchResult, SearchCategory } from '@/types/search';
import styles from './HeaderSearchField.module.scss';

const categories: SearchCategory[] = [
  { id: 'electronics', name: 'Электроника', slug: 'electronics' },
  { id: 'clothing', name: 'Одежда', slug: 'clothing' },
  { id: 'books', name: 'Книги', slug: 'books' },
  { id: 'home', name: 'Товары для дома', slug: 'home' },
];

const HeaderSearchField = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult>({ products: [], categories: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Закрываем выпадающий список при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Поиск по категориям на фронтенде
  const searchCategories = (searchQuery: string): SearchCategory[] => {
    if (!searchQuery) return [];
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Поиск по продуктам через API
  const searchProducts = async (searchQuery: string) => {
    try {
      setIsLoading(true);
      // Здесь будет ваш API-запрос
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      return data.products;
    } catch (error) {
      console.error('Ошибка при поиске продуктов:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик изменения поискового запроса
  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    if (!searchQuery) {
      setResults({ products: [], categories: [] });
      setIsOpen(false);
      return;
    }

    setIsOpen(true);
    const [products, categories] = await Promise.all([
      searchProducts(searchQuery),
      Promise.resolve(searchCategories(searchQuery))
    ]);

    setResults({ products, categories });
  };

  // Обработчик выбора результата
  const handleSelect = (type: 'product' | 'category', item: any) => {
    if (type === 'product') {
      router.push(`/product/${item.id}`);
    } else {
      router.push(`/catalog/${item.slug}`);
    }
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className={styles.searchContainer} ref={searchRef}>
      <div className={styles.searchInput}>
        <input
          type="text"
          placeholder="Поиск товаров и категорий..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && (query || isLoading) && (
        <div className={styles.searchResults}>
          {isLoading ? (
            <div className={styles.loading}>Поиск...</div>
          ) : (
            <>
              {results.categories.length > 0 && (
                <div className={styles.resultsSection}>
                  <h3>Категории</h3>
                  {results.categories.map((category) => (
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

              {results.products.length > 0 && (
                <div className={styles.resultsSection}>
                  <h3>Товары</h3>
                  {results.products.map((product) => (
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

              {!isLoading && results.products.length === 0 && results.categories.length === 0 && (
                <div className={styles.noResults}>
                  Ничего не найдено
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default HeaderSearchField;
