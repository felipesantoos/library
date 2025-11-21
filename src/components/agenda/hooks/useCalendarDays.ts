import { useMemo } from 'react';

/**
 * Generate calendar days for a month view (6 weeks = 42 days)
 * Starts from the Sunday of the week containing the first day of the month
 */
export function useCalendarDays(selectedDate: Date): Date[] {
  return useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday
    
    const days: Date[] = [];
    const current = new Date(startDate);
    
    // Generate 6 weeks (42 days)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  }, [selectedDate]);
}

