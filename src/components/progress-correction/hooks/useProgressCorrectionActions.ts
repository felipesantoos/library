import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateSession, deleteSession, UpdateSessionCommand, SessionDto } from '@/hooks/useSessions';
import { toast } from '@/utils/toast';

interface UseProgressCorrectionActionsProps {
  editingSessions: Map<number, Partial<SessionDto>>;
  deletingSessions: Set<number>;
  errors: Map<number, string>;
  bookId: number;
  onRefresh: () => Promise<void>;
  onClearEditing: () => void;
}

export function useProgressCorrectionActions({
  editingSessions,
  deletingSessions,
  errors,
  bookId,
  onRefresh,
  onClearEditing,
}: UseProgressCorrectionActionsProps) {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const handleSaveAll = async () => {
    setSaving(true);
    const newErrors = new Map(errors);

    try {
      // Validate all edited sessions
      for (const [sessionId, editedSession] of editingSessions.entries()) {
        if (editedSession.start_page !== null && editedSession.end_page !== null) {
          if (editedSession.end_page < editedSession.start_page) {
            newErrors.set(sessionId, 'End page cannot be less than start page');
          }
        }
      }

      if (newErrors.size > 0) {
        setSaving(false);
        toast.warning('Please fix validation errors before saving', `Found ${newErrors.size} error(s)`);
        return;
      }

      // Save all edited sessions
      for (const [sessionId, editedSession] of editingSessions.entries()) {
        const command: UpdateSessionCommand = {
          id: sessionId,
          session_date: editedSession.session_date!,
          start_time: editedSession.start_time || null,
          end_time: editedSession.end_time || null,
          start_page: editedSession.start_page,
          end_page: editedSession.end_page,
          minutes_read: editedSession.minutes_read,
        };
        await updateSession(command);
      }

      // Delete marked sessions
      for (const sessionId of deletingSessions) {
        await deleteSession(sessionId);
      }

      // Clear editing state
      onClearEditing();
      await onRefresh();
      toast.success('Progress corrections saved successfully');
      navigate(`/book/${bookId}`);
    } catch (err) {
      toast.handleError(err, 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  return {
    handleSaveAll,
    saving,
  };
}

