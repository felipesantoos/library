import { useState } from 'react';
import { updateBook, BookDto, UpdateBookCommand } from '@/hooks/useBooks';

export function useArchiveActions(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRestore = async (book: BookDto) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!book.id) {
        throw new Error('Book ID is required');
      }

      const command: UpdateBookCommand = {
        id: book.id,
        is_archived: false,
      };
      
      await updateBook(command);
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to restore book';
      setError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleRestore,
    loading,
    error,
  };
}

