import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateSession, UpdateSessionCommand } from '@/hooks/useSessions';
import { toast } from '@/utils/toast';

interface UseSessionEditSubmitProps {
  sessionId: number;
  onSuccess?: () => void;
}

export function useSessionEditSubmit({ sessionId, onSuccess }: UseSessionEditSubmitProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    command: UpdateSessionCommand,
    validate?: () => string | null
  ) => {
    setError(null);

    if (validate) {
      const validationError = validate();
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setLoading(true);

    try {
      await updateSession(command);
      toast.success('Session updated successfully');
      onSuccess?.();
      navigate('/sessions');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update session';
      setError(message);
      toast.handleError(err, 'Failed to update session');
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSubmit,
    loading,
    error,
  };
}

