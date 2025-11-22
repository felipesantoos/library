import { useState } from 'react';

interface UseSessionFormProps {
  initialBookId?: number | null;
  initialDate?: string;
}

export function useSessionForm({ initialBookId = null, initialDate }: UseSessionFormProps = {}) {
  const [bookId, setBookId] = useState<number | null>(initialBookId);
  const [sessionDate, setSessionDate] = useState(initialDate || new Date().toISOString().split('T')[0]);
  // Initialize with current time in HH:MM:SS format
  const currentTime = new Date().toTimeString().substring(0, 8);
  const [startTime, setStartTime] = useState<string>(currentTime);
  const [endTime, setEndTime] = useState<string>(currentTime);
  const [startPage, setStartPage] = useState<number | null>(null);
  const [endPage, setEndPage] = useState<number | null>(null);
  const [minutesRead, setMinutesRead] = useState<number | null>(null);

  return {
    bookId,
    sessionDate,
    startTime,
    endTime,
    startPage,
    endPage,
    minutesRead,
    setBookId,
    setSessionDate,
    setStartTime,
    setEndTime,
    setStartPage,
    setEndPage,
    setMinutesRead,
  };
}

