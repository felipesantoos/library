import { useMemo } from 'react';
import { DateFilter } from '../SessionsFilters';

export function useSessionDateFilters(dateFilter: DateFilter) {
  return useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const dateFilters = {
      all: { start_date: undefined, end_date: undefined },
      today: { start_date: today, end_date: today },
      week: { start_date: weekAgo, end_date: today },
      month: { start_date: monthAgo, end_date: today },
    };

    return dateFilters[dateFilter];
  }, [dateFilter]);
}

