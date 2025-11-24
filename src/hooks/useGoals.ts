import { invoke } from '@tauri-apps/api/core';
import { useState, useEffect, useCallback } from 'react';

export interface GoalDto {
  id: number | null;
  goal_type: 'pages_monthly' | 'books_yearly' | 'minutes_daily';
  target_value: number;
  period_year: number | null;
  period_month: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  current_progress: number;
  progress_percentage: number;
}

export interface CreateGoalCommand {
  goal_type: 'pages_monthly' | 'books_yearly' | 'minutes_daily';
  target_value: number;
  period_year?: number | null;
  period_month?: number | null;
  is_active?: boolean;
}

export interface StatisticsDto {
  pages_read_this_month: number;
  total_pages_read: number;
  books_completed: number;
  sessions_this_month: number;
  average_pages_per_session: number;
  pages_per_month: Array<{
    year: number;
    month: number;
    pages: number;
  }>;
}

export function useGoals(includeInactive: boolean = false) {
  const [goals, setGoals] = useState<GoalDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadGoals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await invoke<GoalDto[]>('list_goals', {
        filters: {
          include_inactive: includeInactive ? true : null,
        },
      });
      setGoals(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load goals');
    } finally {
      setLoading(false);
    }
  }, [includeInactive]);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  return { goals, loading, error, refresh: loadGoals };
}

export function useStatistics() {
  const [statistics, setStatistics] = useState<StatisticsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStatistics = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  return { statistics, loading, error, refresh: loadStatistics };
}

export async function createGoal(command: CreateGoalCommand): Promise<GoalDto> {
  return await invoke<GoalDto>('create_goal', { command });
}

export async function deleteGoal(id: number): Promise<void> {
  return await invoke<void>('delete_goal', { id });
}

