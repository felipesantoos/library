import { useState } from 'react';
import { createNote, deleteNote, CreateNoteCommand } from '@/hooks/useNotes';

export function useNoteActions(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (command: CreateNoteCommand) => {
    try {
      setLoading(true);
      setError(null);
      await createNote(command);
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create note';
      setError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await deleteNote(id);
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete note';
      setError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleCreate,
    handleDelete,
    loading,
    error,
  };
}

