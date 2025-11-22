import { useState, useEffect } from 'react';
import { SessionDto } from '@/hooks/useSessions';

interface UseSessionEditFormProps {
  session: SessionDto | null;
}

export function useSessionEditForm({ session }: UseSessionEditFormProps) {
  const [sessionDate, setSessionDate] = useState('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [startPage, setStartPage] = useState<number | null>(null);
  const [endPage, setEndPage] = useState<number | null>(null);
  const [minutesRead, setMinutesRead] = useState<number | null>(null);

  // Initialize form with session data
  useEffect(() => {
    if (session) {
      setSessionDate(session.session_date);
      setStartTime(session.start_time || '');
      setEndTime(session.end_time || '');
      setStartPage(session.start_page);
      setEndPage(session.end_page);
      setMinutesRead(session.minutes_read);
    }
  }, [session]);

  return {
    sessionDate,
    startTime,
    endTime,
    startPage,
    endPage,
    minutesRead,
    setSessionDate,
    setStartTime,
    setEndTime,
    setStartPage,
    setEndPage,
    setMinutesRead,
  };
}

