import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listCollections } from './useCollections';

export interface BookCollectionMap {
  [bookId: number]: number[]; // bookId -> collectionIds[]
}

/**
 * Hook to load all book-collection relationships at once
 * Returns a map of bookId -> collectionIds[]
 */
export function useBookCollections(bookIds: number[]) {
  const [bookCollections, setBookCollections] = useState<BookCollectionMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (bookIds.length === 0) {
      setBookCollections({});
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Load collections for all books in parallel
      const promises = bookIds.map(async (bookId) => {
        const collections = await listCollections(bookId);
        return { bookId, collectionIds: collections.map((c) => c.id!).filter((id): id is number => id !== undefined) };
      });

      const results = await Promise.all(promises);
      const map: BookCollectionMap = {};
      results.forEach(({ bookId, collectionIds }) => {
        map[bookId] = collectionIds;
      });
      setBookCollections(map);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load book collections');
    } finally {
      setLoading(false);
    }
  }, [bookIds]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { bookCollections, loading, error, refresh };
}

