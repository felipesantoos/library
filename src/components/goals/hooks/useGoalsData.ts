import { useMemo } from 'react';
import { GoalDto } from '@/hooks/useGoals';

export function useGoalsData(goals: GoalDto[], currentYear: number, currentMonth: number) {
  const goalsByType = useMemo(() => {
    const monthly = goals.filter((g) => g.goal_type === 'pages_monthly');
    const yearly = goals.filter((g) => g.goal_type === 'books_yearly');
    const daily = goals.filter((g) => g.goal_type === 'minutes_daily');
    return { monthly, yearly, daily };
  }, [goals]);

  const currentMonthlyGoal = useMemo(() => {
    return goalsByType.monthly.find(
      (g) => g.period_year === currentYear && g.period_month === currentMonth
    );
  }, [goalsByType.monthly, currentYear, currentMonth]);

  const currentYearlyGoal = useMemo(() => {
    return goalsByType.yearly.find(
      (g) => g.period_year === currentYear
    );
  }, [goalsByType.yearly, currentYear]);

  const currentDailyGoal = useMemo(() => {
    return goalsByType.daily.find(() => true);
  }, [goalsByType.daily]);

  return {
    goalsByType,
    currentMonthlyGoal,
    currentYearlyGoal,
    currentDailyGoal,
  };
}

