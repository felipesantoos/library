import { deleteSession } from '@/hooks/useSessions';
import { toast } from '@/utils/toast';

interface UseSessionActionsProps {
  onRefresh: () => void;
}

export function useSessionActions({ onRefresh }: UseSessionActionsProps) {
  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this session?')) {
      try {
        await deleteSession(id);
        toast.success('Session deleted successfully');
        onRefresh();
      } catch (err) {
        toast.handleError(err, 'Failed to delete session');
      }
    }
  };

  return {
    handleDelete,
  };
}

