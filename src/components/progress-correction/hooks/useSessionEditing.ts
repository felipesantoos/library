import { useState, useMemo, Dispatch, SetStateAction } from 'react';
import { SessionDto } from '@/hooks/useSessions';

interface UseSessionEditingReturn {
  editingSessions: Map<number, Partial<SessionDto>>;
  deletingSessions: Set<number>;
  sortedSessions: SessionDto[];
  handleEditSession: (sessionId: number, field: keyof SessionDto, value: any) => void;
  handleDeleteSession: (sessionId: number) => void;
  handleCancelDelete: (sessionId: number) => void;
  clearEditing: () => void;
}

export function useSessionEditing(
  sessions: SessionDto[],
  setErrors: Dispatch<SetStateAction<Map<number, string>>>
): UseSessionEditingReturn {
  const [editingSessions, setEditingSessions] = useState<Map<number, Partial<SessionDto>>>(new Map());
  const [deletingSessions, setDeletingSessions] = useState<Set<number>>(new Set());

  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => {
      // Sort by date (most recent first), then by created_at if dates are equal
      const dateCompare = b.session_date.localeCompare(a.session_date);
      if (dateCompare !== 0) return dateCompare;
      
      // If dates are equal, sort by created_at (most recent first)
      if (a.created_at && b.created_at) {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    });
  }, [sessions]);

  const handleEditSession = (sessionId: number, field: keyof SessionDto, value: any) => {
    const updated = new Map(editingSessions);
    const session = sortedSessions.find((s) => s.id === sessionId);
    
    if (!session) return;

    if (!updated.has(sessionId)) {
      updated.set(sessionId, { ...session });
    }

    const editedSession = updated.get(sessionId)!;
    (editedSession as any)[field] = value;

    // Recalculate pages_read if start/end page changed
    if (field === 'start_page' || field === 'end_page') {
      const startPage = field === 'start_page' ? value : editedSession.start_page;
      const endPage = field === 'end_page' ? value : editedSession.end_page;
      if (startPage !== null && endPage !== null && endPage >= startPage) {
        (editedSession as any).pages_read = endPage - startPage;
      }
    }

    // Clear errors for this session
    setErrors((prev) => {
      const newErrors = new Map(prev);
      newErrors.delete(sessionId);
      return newErrors;
    });

    updated.set(sessionId, editedSession);
    setEditingSessions(updated);
  };

  const handleDeleteSession = (sessionId: number) => {
    const newDeleting = new Set(deletingSessions);
    newDeleting.add(sessionId);
    setDeletingSessions(newDeleting);
  };

  const handleCancelDelete = (sessionId: number) => {
    const newDeleting = new Set(deletingSessions);
    newDeleting.delete(sessionId);
    setDeletingSessions(newDeleting);
  };

  const clearEditing = () => {
    setEditingSessions(new Map());
    setDeletingSessions(new Set());
  };

  return {
    editingSessions,
    deletingSessions,
    sortedSessions,
    handleEditSession,
    handleDeleteSession,
    handleCancelDelete,
    clearEditing,
  };
}

