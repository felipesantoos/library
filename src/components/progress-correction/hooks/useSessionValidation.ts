import { useMemo } from 'react';
import { SessionDto } from '@/hooks/useSessions';
import { BookDto } from '@/hooks/useBooks';

interface UseSessionValidationResult {
  errors: Map<number, string>;
  warnings: Map<number, string>;
}

export function useSessionValidation(
  sessions: SessionDto[],
  book: BookDto | null
): UseSessionValidationResult {
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

  const { errors, warnings } = useMemo(() => {
    const newWarnings = new Map<number, string>();
    const newErrors = new Map<number, string>();

    sortedSessions.forEach((session, index) => {
      if (!session.id) return;

      // Check end page >= start page
      if (session.start_page !== null && session.end_page !== null) {
        if (session.end_page < session.start_page) {
          newErrors.set(session.id, 'End page cannot be less than start page');
        }
      }

      // Check if session date is in future
      const sessionDate = new Date(session.session_date);
      if (sessionDate > new Date()) {
        newWarnings.set(session.id, 'Session date is in the future');
      }

      // Check for large gaps between sessions
      // Since sessions are sorted most recent first, we need to check the next session (chronologically older)
      if (index < sortedSessions.length - 1 && book?.total_pages) {
        const nextSession = sortedSessions[index + 1]; // Next in array = chronologically older
        if (nextSession.end_page && session.start_page !== null) {
          const gap = session.start_page - nextSession.end_page;
          if (gap > 50) {
            newWarnings.set(
              session.id,
              `Large gap: ${gap} pages since previous session`
            );
          }
        }
      }

      // Check current page <= total pages
      if (book?.total_pages && session.end_page) {
        if (session.end_page > book.total_pages) {
          newErrors.set(
            session.id,
            `End page (${session.end_page}) exceeds total pages (${book.total_pages})`
          );
        }
      }
    });

    return { errors: newErrors, warnings: newWarnings };
  }, [sortedSessions, book]);

  return { errors, warnings };
}

