import { useEffect, useMemo, useState } from 'react';
import type { Diary } from '../types/diary.js';
import { fetchDiaries } from '../api/diaries.js';

export const useDiaries = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchDiaries(page)
      .then((res) => {
        if (cancelled) return;
        setDiaries(res.diaries);
        setTotalPages(res.total_pages);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page]);

  const getById = useMemo(() => {
    return (id: number) => diaries.find((d) => d.diary_id === id);
  }, [diaries]);

  return {
    diaries,
    page,
    totalPages,
    loading,
    error,
    nextPage: () => setPage((p) => Math.min(p + 1, totalPages)),
    prevPage: () => setPage((p) => Math.max(p - 1, 1)),
    getById
  };
};
