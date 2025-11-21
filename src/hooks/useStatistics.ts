import { invoke } from '@tauri-apps/api/core';
import { useState, useEffect } from 'react';

export interface StatisticsDto {
  today: TodayStatistics;
  this_month: MonthStatistics;
  current_book: CurrentBookStatistics | null;
}

export interface TodayStatistics {
  pages_read: number;
  minutes_read: number;
  sessions_count: number;
  duration_seconds: number;
}

export interface MonthStatistics {
  pages_read: number;
  minutes_read: number;
  sessions_count: number;
  books_completed: number;
}

export interface CurrentBookStatistics {
  book_id: number;
  title: string;
  author: string | null;
  cover_url: string | null;
  current_page: number;
  total_pages: number | null;
  progress_percentage: number;
  status: string;
}

export function useStatistics() {
  const [statistics, setStatistics] = useState<StatisticsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await invoke<StatisticsDto>('get_statistics');
      setStatistics(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  return { statistics, loading, error, refresh: loadStatistics };
}

