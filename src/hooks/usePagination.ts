import { useState, useMemo } from 'react';
import { REVIEWS_PER_PAGE } from '@/constants/pagination';

export function usePagination<T>(items: T[]) {
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastItem = currentPage * REVIEWS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - REVIEWS_PER_PAGE;
  const currentItems = useMemo(() => items.slice(indexOfFirstItem, indexOfLastItem), [items, indexOfFirstItem, indexOfLastItem]);

  const totalPages = Math.ceil(items.length / REVIEWS_PER_PAGE);

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return {
    currentPage,
    setCurrentPage,
    nextPage,
    prevPage,
    currentItems,
    totalPages,
  };
}
