// components/catalog/CatalogPage.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Catalog from './components/Catalog';
import styles from './CatalogPage.module.scss';
import { Catalog as CatalogType } from '@/types/catalog';
import Spinner from '../spinner/Spinner';

interface PagedCatalog extends CatalogType {
  page: number;
  totalPages: number;
  total: number;
}

interface CatalogPageProps {
  categoryId: string;
  pageSize?: number;
}

const CatalogPage: React.FC<CatalogPageProps> = ({
  categoryId,
  pageSize = 10,
}) => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PagedCatalog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/catalog/${encodeURIComponent(categoryId)}?page=${page}&limit=${pageSize}`,
      );
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const json: PagedCatalog = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить каталог');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
  }, [page, categoryId]);

  if (error) return <div>{error}</div>;

  return (
    <div>
      <Spinner isLoading={loading} />
      {data && <Catalog catalog={data} />}

      {/* Пагинация */}
      {data && data.totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ‹ Prev
          </button>

          <span>
            {page} / {data.totalPages}
          </span>

          <button
            onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
          >
            Next ›
          </button>
        </div>
      )}
    </div>
  );
};

export default CatalogPage;
