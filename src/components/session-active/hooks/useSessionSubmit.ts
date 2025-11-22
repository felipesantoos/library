import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSession, CreateSessionCommand } from '@/hooks/useSessions';
import { toast } from '@/utils/toast';

interface UseSessionSubmitProps {
  onSuccess?: () => void;
}

export function useSessionSubmit({ onSuccess }: UseSessionSubmitProps = {}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    command: CreateSessionCommand,
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
      await createSession(command);
      toast.success('Session saved successfully');
      onSuccess?.();
      navigate('/sessions');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save session';
      setError(message);
      toast.handleError(err, 'Failed to save session');
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

