import { useMemo } from 'react';
import { SessionDto } from '@/hooks/useSessions';

export function useHomeData(todaySessions: SessionDto[], weekSessions: SessionDto[]) {
  const todayData = useMemo(() => {
    const pages = todaySessions.reduce((sum, s) => sum + (s.pages_read || 0), 0);
    const minutes = todaySessions.reduce((sum, s) => sum + (s.minutes_read || 0), 0);
    const duration = todaySessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);
    
    return {
      pages,
      minutes: minutes || Math.floor(duration / 60),
      sessions: todaySessions.length,
    };
  }, [todaySessions]);

  const weekData = useMemo(() => {
    const daysActive = new Set(weekSessions.map((s) => s.session_date)).size;
    const pages = weekSessions.reduce((sum, s) => sum + (s.pages_read || 0), 0);
    
    return {
      pages,
      daysActive,
      sessions: weekSessions.length,
    };
  }, [weekSessions]);

  return {
    today: todayData,
    week: weekData,
  };
}

