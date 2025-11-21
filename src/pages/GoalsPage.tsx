import React, { useState, useMemo } from 'react';
import { useGoals, useStatistics, createGoal, deleteGoal, CreateGoalCommand } from '@/hooks/useGoals';
import { Container, Stack, Section } from '@/components/ui/layout';
import { Heading, Paragraph, MetaText } from '@/components/ui/typography';
import { ProgressBar } from '@/components/ui/data-display';
import { Target, Plus, BookOpen, Trash2, Trophy, Award, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { HandDrawnDropdown } from '@/components/ui/inputs';

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

  // Group goals by type
  const goalsByType = useMemo(() => {
    const monthly = goals.filter((g) => g.goal_type === 'pages_monthly');
    const yearly = goals.filter((g) => g.goal_type === 'books_yearly');
    const daily = goals.filter((g) => g.goal_type === 'minutes_daily');
    return { monthly, yearly, daily };
  }, [goals]);

  // Get current month/year goals
  const currentMonthlyGoal = goalsByType.monthly.find(
    (g) => g.period_year === currentYear && g.period_month === currentMonth
  );
  const currentYearlyGoal = goalsByType.yearly.find(
    (g) => g.period_year === currentYear
  );
  const currentDailyGoal = goalsByType.daily.find(() => true); // Daily goals don't have period

  // Calculate rankings from statistics
  const rankings = useMemo(() => {
    if (!statistics) return null;

    // Best months (from pages_per_month)
    const bestMonths = [...statistics.pages_per_month]
      .sort((a, b) => b.pages - a.pages)
      .slice(0, 3);

    return {
      bestMonths,
    };
  }, [statistics]);

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
              className="flex items-center space-x-2 px-4 py-2 rounded-md bg-accent-primary text-dark-text-primary hover:bg-accent-primary/90 transition-colors"
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
                  <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="p-4 bg-background-surface">
                    <MetaText className="block mb-1">Total Pages</MetaText>
                    <Paragraph className="text-2xl font-bold">{statistics.total_pages_read}</Paragraph>
                  </HandDrawnBox>
                  <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="p-4 bg-background-surface">
                    <MetaText className="block mb-1">Books Completed</MetaText>
                    <Paragraph className="text-2xl font-bold">{statistics.books_completed}</Paragraph>
                  </HandDrawnBox>
                  <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="p-4 bg-background-surface">
                    <MetaText className="block mb-1">This Month</MetaText>
                    <Paragraph className="text-2xl font-bold">{statistics.pages_read_this_month}</Paragraph>
                  </HandDrawnBox>
                  <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="p-4 bg-background-surface">
                    <MetaText className="block mb-1">Avg Pages/Session</MetaText>
                    <Paragraph className="text-2xl font-bold">
                      {statistics.average_pages_per_session.toFixed(1)}
                    </Paragraph>
                  </HandDrawnBox>
                </div>
              </Stack>
            </Section>
          ) : null}

          {/* Current Goals Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentMonthlyGoal && (
              <Section padding="md" className="bg-accent-primary/10 border-accent-primary/30">
                <Stack spacing="sm">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-accent-primary" />
                    <Heading level={4} className="text-base">Monthly Pages</Heading>
                  </div>
                  <MetaText className="text-xs">
                    {new Date(currentYear, currentMonth - 1).toLocaleString('en-US', { month: 'long' })} {currentYear}
                  </MetaText>
                  <ProgressBar
                    value={currentMonthlyGoal.progress_percentage}
                    label={`${currentMonthlyGoal.current_progress} / ${currentMonthlyGoal.target_value} pages`}
                    size="md"
                  />
                  <Paragraph variant="secondary" className="text-xs">
                    {Math.round(currentMonthlyGoal.progress_percentage)}% complete
                  </Paragraph>
                </Stack>
              </Section>
            )}

            {currentYearlyGoal && (
              <Section padding="md" className="bg-accent-secondary/10 border-accent-secondary/30">
                <Stack spacing="sm">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-accent-secondary" />
                    <Heading level={4} className="text-base">Yearly Books</Heading>
                  </div>
                  <MetaText className="text-xs">{currentYear}</MetaText>
                  <ProgressBar
                    value={currentYearlyGoal.progress_percentage}
                    label={`${currentYearlyGoal.current_progress} / ${currentYearlyGoal.target_value} books`}
                    size="md"
                  />
                  <Paragraph variant="secondary" className="text-xs">
                    {Math.round(currentYearlyGoal.progress_percentage)}% complete
                  </Paragraph>
                </Stack>
              </Section>
            )}

            {currentDailyGoal && (
              <Section padding="md" className="bg-semantic-success/10 border-semantic-success/30">
                <Stack spacing="sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-semantic-success" />
                    <Heading level={4} className="text-base">Daily Minutes</Heading>
                  </div>
                  <MetaText className="text-xs">Today</MetaText>
                  <ProgressBar
                    value={currentDailyGoal.progress_percentage}
                    label={`${currentDailyGoal.current_progress} / ${currentDailyGoal.target_value} minutes`}
                    size="md"
                  />
                  <Paragraph variant="secondary" className="text-xs">
                    {Math.round(currentDailyGoal.progress_percentage)}% complete
                  </Paragraph>
                </Stack>
              </Section>
            )}
          </div>

          {/* Rankings */}
          {rankings && rankings.bestMonths.length > 0 && (
            <Section padding="md">
              <Stack spacing="sm">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-accent-primary" />
                  <Heading level={3}>Best Months</Heading>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {rankings.bestMonths.map((month, index) => {
                    const monthName = new Date(2000, month.month - 1).toLocaleString('en-US', { month: 'long' });
                    return (
                      <HandDrawnBox
                        key={`${month.year}-${month.month}`}
                        borderRadius={6}
                        strokeWidth={1}
                        linearCorners={true}
                        className="p-3 bg-background-surface"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-text-primary">
                            #{index + 1}
                          </span>
                          <Trophy
                            className={cn(
                              "w-4 h-4",
                              index === 0 && "text-yellow-500",
                              index === 1 && "text-gray-400",
                              index === 2 && "text-amber-600"
                            )}
                          />
                        </div>
                        <Paragraph className="text-sm font-medium">{monthName} {month.year}</Paragraph>
                        <MetaText className="text-xs">{month.pages} pages</MetaText>
                      </HandDrawnBox>
                    );
                  })}
                </div>
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
            <Stack spacing="lg">
              {/* Monthly Goals */}
              {goalsByType.monthly.length > 0 && (
                <Stack spacing="sm">
                  <Heading level={3} className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-accent-primary" />
                    <span>Monthly Goals</span>
                  </Heading>
                  <Stack spacing="sm">
                    {goalsByType.monthly
                      .sort((a, b) => {
                        const yearCompare = (b.period_year || 0) - (a.period_year || 0);
                        if (yearCompare !== 0) return yearCompare;
                        return (b.period_month || 0) - (a.period_month || 0);
                      })
                      .map((goal) => (
                        <GoalCard key={goal.id} goal={goal} onDelete={handleDelete} />
                      ))}
                  </Stack>
                </Stack>
              )}

              {/* Yearly Goals */}
              {goalsByType.yearly.length > 0 && (
                <Stack spacing="sm">
                  <Heading level={3} className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-accent-secondary" />
                    <span>Yearly Goals</span>
                  </Heading>
                  <Stack spacing="sm">
                    {goalsByType.yearly
                      .sort((a, b) => (b.period_year || 0) - (a.period_year || 0))
                      .map((goal) => (
                        <GoalCard key={goal.id} goal={goal} onDelete={handleDelete} />
                      ))}
                  </Stack>
                </Stack>
              )}

              {/* Daily Goals */}
              {goalsByType.daily.length > 0 && (
                <Stack spacing="sm">
                  <Heading level={3} className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-semantic-success" />
                    <span>Daily Goals</span>
                  </Heading>
                  <Stack spacing="sm">
                    {goalsByType.daily.map((goal) => (
                      <GoalCard key={goal.id} goal={goal} onDelete={handleDelete} />
                    ))}
                  </Stack>
                </Stack>
              )}
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
    return 'Daily';
  };

  const formatLabel = () => {
    switch (goal.goal_type) {
      case 'pages_monthly':
        return `${goal.current_progress} / ${goal.target_value} pages`;
      case 'books_yearly':
        return `${goal.current_progress} / ${goal.target_value} books`;
      case 'minutes_daily':
        return `${goal.current_progress} / ${goal.target_value} minutes`;
      default:
        return `${goal.current_progress} / ${goal.target_value}`;
    }
  };

  const getIcon = () => {
    switch (goal.goal_type) {
      case 'pages_monthly':
        return <BookOpen className="w-5 h-5 text-accent-primary" />;
      case 'books_yearly':
        return <Trophy className="w-5 h-5 text-accent-secondary" />;
      case 'minutes_daily':
        return <Clock className="w-5 h-5 text-semantic-success" />;
      default:
        return <Target className="w-5 h-5 text-accent-primary" />;
    }
  };

  const getProgressColor = () => {
    if (goal.progress_percentage >= 100) return 'text-semantic-success';
    if (goal.progress_percentage >= 75) return 'text-accent-primary';
    if (goal.progress_percentage >= 50) return 'text-semantic-warning';
    return 'text-text-secondary';
  };

  return (
    <Section padding="md" className="hover:shadow-medium transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Stack spacing="sm">
            <div className="flex items-center space-x-3">
              {getIcon()}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <Heading level={4} className="text-base">
                    {formatPeriod()}
                  </Heading>
                  <MetaText className={cn("text-xs font-medium", getProgressColor())}>
                    {Math.round(goal.progress_percentage)}%
                  </MetaText>
                </div>
              </div>
            </div>

            <ProgressBar
              value={goal.progress_percentage}
              label={formatLabel()}
              size="sm"
            />
          </Stack>
        </div>

        {goal.id && (
          <button
            onClick={() => onDelete(goal.id!)}
            className="p-2 text-text-secondary hover:text-semantic-error transition-colors ml-4"
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
            <HandDrawnDropdown
              options={[
                { value: 'pages_monthly', label: 'Pages (Monthly)' },
                { value: 'books_yearly', label: 'Books (Yearly)' },
                { value: 'minutes_daily', label: 'Minutes (Daily)' },
              ]}
              value={goalType}
              onChange={(value) => setGoalType(value as 'pages_monthly' | 'books_yearly' | 'minutes_daily')}
              placeholder="Select goal type..."
              borderRadius={6}
              strokeWidth={1}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {goalType === 'pages_monthly' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Year
                  </label>
                  <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                    <input
                      type="number"
                      required
                      value={periodYear}
                      onChange={(e) => setPeriodYear(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none"
                      min={2020}
                      max={2100}
                    />
                  </HandDrawnBox>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Month
                  </label>
                  <HandDrawnDropdown
                    options={Array.from({ length: 12 }, (_, i) => i + 1).map((month) => ({
                      value: month,
                      label: new Date(2000, month - 1).toLocaleString('en-US', { month: 'long' }),
                    }))}
                    value={periodMonth}
                    onChange={(value) => setPeriodMonth(value ? (typeof value === 'number' ? value : parseInt(value as string)) : currentMonth)}
                    placeholder="Select month..."
                    borderRadius={6}
                    strokeWidth={1}
                  />
                </div>
              </>
            )}

            {goalType === 'books_yearly' && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Year
                </label>
                <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                  <input
                    type="number"
                    required
                    value={periodYear}
                    onChange={(e) => setPeriodYear(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none"
                    min={2020}
                    max={2100}
                  />
                </HandDrawnBox>
              </div>
            )}

            {goalType === 'minutes_daily' && (
              <div>
                <MetaText className="text-xs text-text-secondary">
                  Daily goals track minutes read each day. No period selection needed.
                </MetaText>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Target *
            </label>
            <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
              <input
                type="number"
                required
                min={1}
                value={targetValue}
                onChange={(e) => setTargetValue(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none"
                placeholder={
                  goalType === 'pages_monthly'
                    ? 'e.g., 500 pages'
                    : goalType === 'books_yearly'
                    ? 'e.g., 24 books'
                    : 'e.g., 60 minutes'
                }
              />
            </HandDrawnBox>
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
              className="px-4 py-2 rounded-md bg-accent-primary text-dark-text-primary hover:bg-accent-primary/90 transition-colors"
            >
              Create Goal
            </button>
          </div>
        </Stack>
      </form>
    </Section>
  );
}

