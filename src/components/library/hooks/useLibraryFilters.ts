import { useMemo } from 'react';
import { BookDto } from '@/hooks/useBooks';
import { BookCollectionMap } from '@/hooks/useBookCollections';

interface UseLibraryFiltersProps {
  books: BookDto[];
  statusFilter: string;
  typeFilter: string;
  searchQuery: string;
  collectionFilter: number | null;
  bookCollections?: BookCollectionMap;
}

export function useLibraryFilters({
  books,
  statusFilter,
  typeFilter,
  searchQuery,
  collectionFilter,
  bookCollections,
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

    if (collectionFilter !== null && collectionFilter !== undefined && bookCollections) {
      filtered = filtered.filter((book) => {
        if (!book.id) return false;
        const collectionIds = bookCollections[book.id];
        // If the book is not in the map yet, it means collections are still loading
        // In that case, show the book until we know for sure
        if (collectionIds === undefined) {
          return true; // Keep visible while loading
        }
        // Book is in the map, check if it has the collection
        return collectionIds.includes(collectionFilter);
      });
    }

    return filtered;
  }, [books, statusFilter, typeFilter, searchQuery, collectionFilter, bookCollections]);
}

