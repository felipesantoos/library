import { useMemo } from 'react';
import { BookDto } from '@/hooks/useBooks';
import { SessionDto } from '@/hooks/useSessions';

export interface ProgressDataPoint {
  date: string;
  pages: number;
  cumulative: number;
  progress: number;
}

export function useBookProgressData(book: BookDto | null, sessions: SessionDto[]): ProgressDataPoint[] {
  return useMemo(() => {
    if (!book || sessions.length === 0) return [];

    // Group sessions by date and calculate cumulative progress
    const sessionsByDate = new Map<string, SessionDto[]>();
    sessions.forEach(session => {
      const date = session.session_date;
      if (!sessionsByDate.has(date)) {
        sessionsByDate.set(date, []);
      }
      sessionsByDate.get(date)!.push(session);
    });

    // Calculate cumulative pages read
    let cumulativePages = 0;
    const sortedDates = Array.from(sessionsByDate.keys()).sort();
    
    return sortedDates.map(date => {
      const dateSessions = sessionsByDate.get(date)!;
      const pagesRead = dateSessions.reduce((sum, s) => sum + (s.pages_read || 0), 0);
      cumulativePages += pagesRead;
      
      const startPage = book.current_page_text - cumulativePages;
      const progress = book.total_pages 
        ? ((startPage + cumulativePages) / book.total_pages * 100).toFixed(1)
        : 0;

      return {
        date,
        pages: pagesRead,
        cumulative: cumulativePages,
        progress: parseFloat(progress),
      };
    });
  }, [book, sessions]);
}

