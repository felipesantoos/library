import { GoalDto } from '@/hooks/useGoals';
import { CurrentGoalCard } from './CurrentGoalCard';

interface CurrentGoalsOverviewProps {
  monthlyGoal: GoalDto | undefined;
  yearlyGoal: GoalDto | undefined;
  dailyGoal: GoalDto | undefined;
  currentYear: number;
  currentMonth: number;
}

export function CurrentGoalsOverview({
  monthlyGoal,
  yearlyGoal,
  dailyGoal,
  currentYear,
  currentMonth,
}: CurrentGoalsOverviewProps) {
  if (!monthlyGoal && !yearlyGoal && !dailyGoal) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {monthlyGoal && (
        <CurrentGoalCard
          goal={monthlyGoal}
          type="monthly"
          periodLabel={new Date(currentYear, currentMonth - 1).toLocaleString('en-US', { month: 'long' }) + ' ' + currentYear}
        />
      )}
      {yearlyGoal && (
        <CurrentGoalCard
          goal={yearlyGoal}
          type="yearly"
          periodLabel={currentYear.toString()}
        />
      )}
      {dailyGoal && (
        <CurrentGoalCard
          goal={dailyGoal}
          type="daily"
          periodLabel="Today"
        />
      )}
    </div>
  );
}

