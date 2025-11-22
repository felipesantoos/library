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
    if (!book || sessions.length === 0 || !book.total_pages) return [];

    // Filter sessions that have end_page (required for progress calculation)
    const sessionsWithEndPage = sessions.filter(s => s.end_page !== null && s.end_page !== undefined);
    if (sessionsWithEndPage.length === 0) return [];

    // Group sessions by date
    const sessionsByDate = new Map<string, SessionDto[]>();
    sessionsWithEndPage.forEach(session => {
      const date = session.session_date;
      if (!sessionsByDate.has(date)) {
        sessionsByDate.set(date, []);
      }
      sessionsByDate.get(date)!.push(session);
    });

    // Sort sessions by date (oldest first) to calculate progress chronologically
    const sortedDates = Array.from(sessionsByDate.keys()).sort();
    
    console.log('[useBookProgressData] Book info:', {
      current_page_text: book.current_page_text,
      total_pages: book.total_pages,
      sessions_count: sessions.length,
      sessions_with_end_page: sessionsWithEndPage.length,
    });
    
    // Calculate progress at each date point using the maximum end_page for that date
    // (in case there are multiple sessions on the same date)
    return sortedDates.map(date => {
      const dateSessions = sessionsByDate.get(date)!;
      
      // Get the maximum end_page for this date (most recent progress)
      const maxEndPage = Math.max(...dateSessions.map(s => s.end_page!).filter(p => p !== null));
      
      // Calculate total pages read on this date
      const pagesRead = dateSessions.reduce((sum, s) => sum + (s.pages_read || 0), 0);
      
      // Progress at this point = end_page / total_pages
      const progress = book.total_pages 
        ? Math.min(100, (maxEndPage / book.total_pages) * 100)
        : 0;

      const result = {
        date,
        pages: pagesRead,
        cumulative: maxEndPage, // Use end_page as cumulative (it's the actual page reached)
        progress: parseFloat(progress.toFixed(1)),
      };
      
      console.log(`[useBookProgressData] Date: ${date}, End page: ${maxEndPage}, Pages read: ${pagesRead}, Progress: ${result.progress}%`);
      
      return result;
    });
  }, [book, sessions]);
}

