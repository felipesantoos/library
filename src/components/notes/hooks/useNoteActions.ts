import { useState } from 'react';
import { createNote, deleteNote, updateNote, CreateNoteCommand, UpdateNoteCommand } from '@/hooks/useNotes';
import { toast } from 'sonner';

export function useNoteActions(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (command: CreateNoteCommand) => {
    try {
      setLoading(true);
      setError(null);
      await createNote(command);
      toast.success('Note created successfully');
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create note';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (command: UpdateNoteCommand) => {
    try {
      setLoading(true);
      setError(null);
      await updateNote(command);
      toast.success('Note updated successfully');
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update note';
      setError(message);
      toast.error(message);
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
      toast.success('Note deleted successfully');
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete note';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleCreate,
    handleUpdate,
    handleDelete,
    loading,
    error,
  };
}

