import { useEffect, useMemo } from 'react';
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
    return [...sessions].sort((a, b) => a.session_date.localeCompare(b.session_date));
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
      if (index > 0 && book?.total_pages) {
        const prevSession = sortedSessions[index - 1];
        if (prevSession.end_page && session.start_page !== null) {
          const gap = session.start_page - prevSession.end_page;
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

