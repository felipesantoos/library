import { useState } from 'react';
import { createJournalEntry, updateJournalEntry, deleteJournalEntry, CreateJournalEntryCommand, UpdateJournalEntryCommand } from '@/hooks/useJournalEntries';

export function useJournalActions(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (command: CreateJournalEntryCommand) => {
    try {
      setLoading(true);
      setError(null);
      await createJournalEntry(command);
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create journal entry';
      setError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (command: UpdateJournalEntryCommand) => {
    try {
      setLoading(true);
      setError(null);
      await updateJournalEntry(command);
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update journal entry';
      setError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this journal entry?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await deleteJournalEntry(id);
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete journal entry';
      setError(message);
      alert(message);
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

