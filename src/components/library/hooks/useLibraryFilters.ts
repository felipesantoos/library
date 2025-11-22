import { useMemo } from 'react';
import { BookDto } from '@/hooks/useBooks';

interface UseLibraryFiltersProps {
  books: BookDto[];
  statusFilter: string;
  typeFilter: string;
  searchQuery: string;
}

export function useLibraryFilters({
  books,
  statusFilter,
  typeFilter,
  searchQuery,
}: UseLibraryFiltersProps) {
  return useMemo(() => {
    let filtered = [...books];

    if (statusFilter) {
      filtered = filtered.filter((book) => book.status === statusFilter);
    }

    if (typeFilter) {
      filtered = filtered.filter((book) => book.book_type === typeFilter);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          (book.author && book.author.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [books, statusFilter, typeFilter, searchQuery]);
}

