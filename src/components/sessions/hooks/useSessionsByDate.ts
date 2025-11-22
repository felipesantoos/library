import { useMemo } from 'react';
import { SessionDto } from '@/hooks/useSessions';

export function useSessionsByDate(sessions: SessionDto[]): Record<string, SessionDto[]> {
  return useMemo(() => {
    return sessions.reduce((acc, session) => {
      const date = session.session_date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(session);
      return acc;
    }, {} as Record<string, SessionDto[]>);
  }, [sessions]);
}

