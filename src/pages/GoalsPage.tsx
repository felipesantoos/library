import React, { useState } from 'react';
import { useGoals, useStatistics, createGoal, deleteGoal, CreateGoalCommand } from '@/hooks/useGoals';
import { Container, Stack, Section } from '@/components/ui/layout';
import { Heading, Paragraph, MetaText } from '@/components/ui/typography';
import { ProgressBar } from '@/components/ui/data-display';
import { Target, Plus, TrendingUp, BookOpen, Calendar, Trash2 } from 'lucide-react';

export function GoalsPage() {
  const [showForm, setShowForm] = useState(false);
  const { goals, loading: goalsLoading, error: goalsError, refresh: refreshGoals } = useGoals(false);
  const { statistics, loading: statsLoading, error: statsError } = useStatistics();

  const handleCreate = async (command: CreateGoalCommand) => {
    try {
      await createGoal(command);
      setShowForm(false);
      refreshGoals();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create goal');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      try {
        await deleteGoal(id);
        refreshGoals();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete goal');
      }
    }
  };

  // Get current month/year for default goal period
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // Get monthly goal if exists
  const monthlyGoal = goals.find(
    (g) => g.goal_type === 'pages_monthly' && g.period_year === currentYear && g.period_month === currentMonth
  );

  return (
    <Container>
      <div className="py-8">
        <Stack spacing="lg">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <Heading level={1}>The Scholar's Compendium</Heading>
              <Paragraph variant="secondary" className="mt-2">
                Track your reading goals and statistics
              </Paragraph>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center space-x-2 px-4 py-2 rounded-md bg-accent-primary text-white hover:bg-accent-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Goal</span>
            </button>
          </div>

          {/* Statistics Overview */}
          {statsLoading ? (
            <Section padding="lg">
              <Paragraph>Loading statistics...</Paragraph>
            </Section>
          ) : statsError ? (
            <Section padding="lg">
              <Paragraph variant="secondary" className="text-semantic-error">
                Error: {statsError}
              </Paragraph>
            </Section>
          ) : statistics ? (
            <Section padding="md">
              <Stack spacing="md">
                <Heading level={3}>Statistics Overview</Heading>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-md bg-background-surface border border-background-border">
                    <MetaText className="block mb-1">Total Pages</MetaText>
                    <Paragraph className="text-2xl font-bold">{statistics.total_pages_read}</Paragraph>
                  </div>
                  <div className="p-4 rounded-md bg-background-surface border border-background-border">
                    <MetaText className="block mb-1">Books Completed</MetaText>
                    <Paragraph className="text-2xl font-bold">{statistics.books_completed}</Paragraph>
                  </div>
                  <div className="p-4 rounded-md bg-background-surface border border-background-border">
                    <MetaText className="block mb-1">This Month</MetaText>
                    <Paragraph className="text-2xl font-bold">{statistics.pages_read_this_month}</Paragraph>
                  </div>
                  <div className="p-4 rounded-md bg-background-surface border border-background-border">
                    <MetaText className="block mb-1">Avg Pages/Session</MetaText>
                    <Paragraph className="text-2xl font-bold">
                      {statistics.average_pages_per_session.toFixed(1)}
                    </Paragraph>
                  </div>
                </div>
              </Stack>
            </Section>
          ) : null}

          {/* Current Monthly Goal */}
          {monthlyGoal && (
            <Section padding="md">
              <Stack spacing="sm">
                <div className="flex items-center justify-between">
                  <Heading level={4}>Current Monthly Goal</Heading>
                  <button
                    onClick={() => handleDelete(monthlyGoal.id!)}
                    className="p-2 text-text-secondary hover:text-semantic-error transition-colors"
                    aria-label="Delete goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <ProgressBar
                  value={monthlyGoal.progress_percentage}
                  label={`${monthlyGoal.current_progress} / ${monthlyGoal.target_value} pages`}
                  size="md"
                />
                <Paragraph variant="secondary" className="text-sm">
                  {monthlyGoal.target_value - monthlyGoal.current_progress} pages remaining this month
                </Paragraph>
              </Stack>
            </Section>
          )}

          {/* Goal Form */}
          {showForm && (
            <GoalForm
              currentYear={currentYear}
              currentMonth={currentMonth}
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
            />
          )}

          {/* Active Goals List */}
          {goalsLoading ? (
            <Section padding="lg">
              <Paragraph>Loading goals...</Paragraph>
            </Section>
          ) : goalsError ? (
            <Section padding="lg">
              <Paragraph variant="secondary" className="text-semantic-error">
                Error: {goalsError}
              </Paragraph>
            </Section>
          ) : goals.length === 0 ? (
            <Section padding="lg">
              <div className="text-center py-12">
                <Target className="w-16 h-16 mx-auto text-text-secondary mb-4" />
                <Heading level={3}>No goals set</Heading>
                <Paragraph variant="secondary" className="mt-2">
                  Create a goal to start tracking your reading progress
                </Paragraph>
              </div>
            </Section>
          ) : (
            <Stack spacing="sm">
              <Heading level={3}>Active Goals</Heading>
              {goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} onDelete={handleDelete} />
              ))}
            </Stack>
          )}
        </Stack>
      </div>
    </Container>
  );
}

function GoalCard({
  goal,
  onDelete,
}: {
  goal: any;
  onDelete: (id: number) => void;
}) {
  const formatPeriod = () => {
    if (goal.period_year && goal.period_month) {
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
      ];
      return `${monthNames[goal.period_month - 1]} ${goal.period_year}`;
    } else if (goal.period_year) {
      return `${goal.period_year}`;
    }
    return 'No period';
  };

  const formatType = () => {
    switch (goal.goal_type) {
      case 'pages_monthly':
        return 'Pages (Monthly)';
      case 'books_yearly':
        return 'Books (Yearly)';
      case 'minutes_daily':
        return 'Minutes (Daily)';
      default:
        return goal.goal_type;
    }
  };

  return (
    <Section padding="md" className="hover:shadow-medium transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Stack spacing="sm">
            <div className="flex items-center space-x-3">
              <Target className="w-5 h-5 text-accent-primary" />
              <div>
                <Heading level={4} className="text-base">
                  {formatType()}
                </Heading>
                <MetaText className="text-xs">{formatPeriod()}</MetaText>
              </div>
            </div>

            <ProgressBar
              value={goal.progress_percentage}
              label={`${goal.current_progress} / ${goal.target_value}`}
              size="sm"
            />

            <Paragraph variant="secondary" className="text-sm">
              {Math.round(goal.progress_percentage)}% complete
            </Paragraph>
          </Stack>
        </div>

        {goal.id && (
          <button
            onClick={() => onDelete(goal.id!)}
            className="p-2 text-text-secondary hover:text-semantic-error transition-colors"
            aria-label="Delete goal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </Section>
  );
}

function GoalForm({
  currentYear,
  currentMonth,
  onSubmit,
  onCancel,
}: {
  currentYear: number;
  currentMonth: number;
  onSubmit: (command: CreateGoalCommand) => void;
  onCancel: () => void;
}) {
  const [goalType, setGoalType] = useState<'pages_monthly' | 'books_yearly' | 'minutes_daily'>('pages_monthly');
  const [targetValue, setTargetValue] = useState<number>(500);
  const [periodYear, setPeriodYear] = useState<number>(currentYear);
  const [periodMonth, setPeriodMonth] = useState<number>(currentMonth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      goal_type: goalType,
      target_value: targetValue,
      period_year: goalType === 'pages_monthly' || goalType === 'books_yearly' ? periodYear : null,
      period_month: goalType === 'pages_monthly' ? periodMonth : null,
      is_active: true,
    });
  };

  return (
    <Section padding="md" className="bg-background-surface border-2 border-accent-primary">
      <form onSubmit={handleSubmit}>
        <Stack spacing="md">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Goal Type *
            </label>
            <select
              required
              value={goalType}
              onChange={(e) => setGoalType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
            >
              <option value="pages_monthly">Pages (Monthly)</option>
              <option value="books_yearly">Books (Yearly)</option>
              <option value="minutes_daily">Minutes (Daily)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {goalType === 'pages_monthly' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    required
                    value={periodYear}
                    onChange={(e) => setPeriodYear(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    min={2020}
                    max={2100}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Month
                  </label>
                  <select
                    required
                    value={periodMonth}
                    onChange={(e) => setPeriodMonth(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <option key={month} value={month}>
                        {new Date(2000, month - 1).toLocaleString('en-US', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {goalType === 'books_yearly' && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Year
                </label>
                <input
                  type="number"
                  required
                  value={periodYear}
                  onChange={(e) => setPeriodYear(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  min={2020}
                  max={2100}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Target *
            </label>
            <input
              type="number"
              required
              min={1}
              value={targetValue}
              onChange={(e) => setTargetValue(parseInt(e.target.value))}
              className="w-full px-3 py-2 rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              placeholder={goalType === 'pages_monthly' ? 'Pages' : goalType === 'books_yearly' ? 'Books' : 'Minutes'}
            />
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-md border border-background-border text-text-secondary hover:bg-background-surface transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-accent-primary text-white hover:bg-accent-primary/90 transition-colors"
            >
              Create Goal
            </button>
          </div>
        </Stack>
      </form>
    </Section>
  );
}

