import { useState } from 'react';
import { useGoals, useStatistics } from '@/hooks/useGoals';
import { Container, Stack } from '@/components/ui/layout';
import { Paragraph } from '@/components/ui/typography';
import {
  GoalsHeader,
  StatisticsOverview,
  CurrentGoalsOverview,
  BestMonthsRanking,
  GoalsList,
  EmptyGoalsState,
  GoalForm,
  useGoalsData,
  useBestMonths,
  useGoalActions,
} from '@/components/goals';

export function GoalsPage() {
  const [showForm, setShowForm] = useState(false);
  const { goals, loading: goalsLoading, error: goalsError, refresh: refreshGoals } = useGoals(false);
  const { statistics, loading: statsLoading, error: statsError } = useStatistics();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const { currentMonthlyGoal, currentYearlyGoal, currentDailyGoal } = useGoalsData(
    goals,
    currentYear,
    currentMonth
  );

  const rankings = useBestMonths(statistics);

  const { handleCreate, handleDelete } = useGoalActions(refreshGoals);

  const handleFormSubmit = (command: any) => {
    handleCreate(command);
    setShowForm(false);
  };

  return (
    <Container>
      <div className="py-8">
        <Stack spacing="lg">
          <GoalsHeader onNewGoalClick={() => setShowForm(!showForm)} />

          <StatisticsOverview
            statistics={statistics}
            loading={statsLoading}
            error={statsError}
          />

          <CurrentGoalsOverview
            monthlyGoal={currentMonthlyGoal}
            yearlyGoal={currentYearlyGoal}
            dailyGoal={currentDailyGoal}
            currentYear={currentYear}
            currentMonth={currentMonth}
          />

          {rankings && rankings.bestMonths.length > 0 && (
            <BestMonthsRanking bestMonths={rankings.bestMonths} />
          )}

          {showForm && (
            <GoalForm
              currentYear={currentYear}
              currentMonth={currentMonth}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
            />
          )}

          {goalsLoading ? (
            <Stack>
              <Paragraph>Loading goals...</Paragraph>
            </Stack>
          ) : goalsError ? (
            <Stack>
              <Paragraph variant="secondary" className="text-semantic-error">
                Error: {goalsError}
              </Paragraph>
            </Stack>
          ) : goals.length === 0 ? (
            <EmptyGoalsState />
          ) : (
            <GoalsList goals={goals} onDelete={handleDelete} />
          )}
        </Stack>
      </div>
    </Container>
  );
}
