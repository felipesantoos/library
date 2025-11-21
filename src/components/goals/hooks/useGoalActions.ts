import { useState } from 'react';
import { createGoal, deleteGoal, CreateGoalCommand } from '@/hooks/useGoals';

export function useGoalActions(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (command: CreateGoalCommand) => {
    try {
      setLoading(true);
      setError(null);
      await createGoal(command);
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create goal';
      setError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this goal?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await deleteGoal(id);
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete goal';
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

