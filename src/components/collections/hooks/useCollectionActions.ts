import { useState } from 'react';
import { deleteCollection, CollectionDto } from '@/hooks/useCollections';

export function useCollectionActions(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete the collection "${name}"?`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await deleteCollection(id);
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete collection';
      setError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleDelete,
    loading,
    error,
  };
}

