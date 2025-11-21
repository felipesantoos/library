import { useState } from 'react';
import { 
  createAgendaBlock, 
  updateAgendaBlock, 
  deleteAgendaBlock,
  CreateAgendaBlockCommand,
  UpdateAgendaBlockCommand 
} from '@/hooks/useAgendaBlocks';

export function useAgendaActions(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async (command: CreateAgendaBlockCommand) => {
    try {
      setLoading(true);
      setError(null);
      await createAgendaBlock(command);
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create agenda block';
      setError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (command: UpdateAgendaBlockCommand) => {
    try {
      setLoading(true);
      setError(null);
      await updateAgendaBlock(command);
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update agenda block';
      setError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this agenda block?')) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      await deleteAgendaBlock(id);
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete agenda block';
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

