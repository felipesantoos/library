import { invoke } from '@tauri-apps/api/core';
import { useState, useEffect, useCallback } from 'react';

export interface BookDto {
  id: number | null;
  title: string;
  author: string | null;
  genre: string | null;
  book_type: string;
  isbn: string | null;
  publication_year: number | null;
  total_pages: number | null;
  total_minutes: number | null;
  current_page_text: number;
  current_minutes_audio: number;
  status: string;
  is_archived: boolean;
  is_wishlist: boolean;
  cover_url: string | null;
  url: string | null;
  added_at: string;
  updated_at: string;
  status_changed_at: string | null;
  progress_percentage: number;
}

export interface CreateBookCommand {
  title: string;
  author?: string;
  genre?: string;
  book_type: string;
  isbn?: string;
  publication_year?: number;
  total_pages?: number;
  total_minutes?: number;
  cover_url?: string;
  url?: string;
  is_wishlist?: boolean;
  status?: string;
}

export function useBooks(filters?: {
  status?: string;
  book_type?: string;
  is_archived?: boolean;
  is_wishlist?: boolean;
  collection_id?: number;
}) {
  const [books, setBooks] = useState<BookDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extrair valores primitivos para usar como dependências estáveis
  const status = filters?.status;
  const bookType = filters?.book_type;
  const isArchived = filters?.is_archived;
  const isWishlist = filters?.is_wishlist;
  const collectionId = filters?.collection_id;

  useEffect(() => {
    let cancelled = false;

    const loadBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        const filters: {
          status?: string;
          book_type?: string;
          is_archived?: boolean;
          is_wishlist?: boolean;
          collection_id?: number;
        } = {};
        if (status) filters.status = status;
        if (bookType) filters.book_type = bookType;
        // Always include boolean params if they are explicitly set (including false)
        if (isArchived !== undefined) {
          filters.is_archived = isArchived;
        }
        if (isWishlist !== undefined) {
          filters.is_wishlist = isWishlist;
        }
        if (collectionId !== undefined && collectionId !== null) {
          filters.collection_id = collectionId;
        }
        
        const result = await invoke<BookDto[]>('list_books', { filters: Object.keys(filters).length > 0 ? filters : undefined });
        if (!cancelled) {
          setBooks(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load books');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadBooks();

    return () => {
      cancelled = true;
    };
  }, [status, bookType, isArchived, isWishlist, collectionId]);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const filters: {
        status?: string;
        book_type?: string;
        is_archived?: boolean;
        is_wishlist?: boolean;
        collection_id?: number;
      } = {};
      if (status) filters.status = status;
      if (bookType) filters.book_type = bookType;
      // Always include boolean params if they are explicitly set (including false)
      if (isArchived !== undefined) {
        filters.is_archived = isArchived;
      }
      if (isWishlist !== undefined) {
        filters.is_wishlist = isWishlist;
      }
      if (collectionId !== undefined && collectionId !== null) {
        filters.collection_id = collectionId;
      }
      
      const result = await invoke<BookDto[]>('list_books', { filters: Object.keys(filters).length > 0 ? filters : undefined });
      setBooks(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load books');
    } finally {
      setLoading(false);
    }
  }, [status, bookType, isArchived, isWishlist, collectionId]);

  return { books, loading, error, refresh };
}

export function useBook(id: number | null) {
  const [book, setBook] = useState<BookDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setBook(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadBook = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await invoke<BookDto>('get_book', { id });
        if (!cancelled) {
          setBook(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load book');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadBook();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const refresh = useCallback(async () => {
    if (id === null) return;
    try {
      setLoading(true);
      setError(null);
      const result = await invoke<BookDto>('get_book', { id });
      setBook(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load book');
    } finally {
      setLoading(false);
    }
  }, [id]);

  return { book, loading, error, refresh };
}

export interface UpdateBookCommand {
  id: number;
  title?: string;
  author?: string;
  genre?: string;
  book_type?: string;
  isbn?: string;
  publication_year?: number;
  total_pages?: number;
  total_minutes?: number;
  current_page_text?: number;
  current_minutes_audio?: number;
  status?: string;
  is_archived?: boolean;
  is_wishlist?: boolean;
  cover_url?: string;
  url?: string;
}

export async function createBook(command: CreateBookCommand): Promise<BookDto> {
  return await invoke<BookDto>('create_book', { command });
}

export async function updateBook(command: UpdateBookCommand): Promise<BookDto> {
  return await invoke<BookDto>('update_book', { command });
}

export async function deleteBook(id: number): Promise<void> {
  return await invoke<void>('delete_book', { id });
}

