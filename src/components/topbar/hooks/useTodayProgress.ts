import { useMemo } from 'react';
import { useSessions, SessionDto } from '@/hooks/useSessions';

export function useTodayProgress() {
  const today = new Date().toISOString().split('T')[0];
  const { sessions, loading } = useSessions({
    start_date: today,
    end_date: today,
  });

  const progress = useMemo(() => {
    const pagesRead = sessions.reduce((sum, s) => sum + (s.pages_read || 0), 0);
    const minutesRead = sessions.reduce((sum, s) => {
      if (s.minutes_read) {
        return sum + s.minutes_read;
      }
      if (s.duration_seconds) {
        return sum + Math.floor(s.duration_seconds / 60);
      }
      return sum;
    }, 0);

    return {
      pagesRead,
      minutesRead,
      sessionsCount: sessions.length,
    };
  }, [sessions]);

  return {
    ...progress,
    loading,
  };
}

