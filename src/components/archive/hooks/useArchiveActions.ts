import { useState } from 'react';
import { updateBook, BookDto } from '@/hooks/useBooks';

export function useArchiveActions(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRestore = async (book: BookDto) => {
    try {
      setLoading(true);
      setError(null);
      await updateBook({
        ...book,
        is_archived: false,
      });
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

