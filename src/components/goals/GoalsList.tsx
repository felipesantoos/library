import { GoalDto } from '@/hooks/useGoals';
import { Stack } from '@/components/ui/layout';
import { Heading } from '@/components/ui/typography';
import { BookOpen, Trophy, Clock } from 'lucide-react';
import { GoalCard } from './GoalCard';

interface GoalsListProps {
  goals: GoalDto[];
  onDelete: (id: number) => void;
}

export function GoalsList({ goals, onDelete }: GoalsListProps) {
  const monthly = goals.filter((g) => g.goal_type === 'pages_monthly');
  const yearly = goals.filter((g) => g.goal_type === 'books_yearly');
  const daily = goals.filter((g) => g.goal_type === 'minutes_daily');

  return (
    <Stack spacing="lg">
      {monthly.length > 0 && (
        <Stack spacing="sm">
          <Heading level={3} className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-accent-primary" />
            <span>Monthly Goals</span>
          </Heading>
          <Stack spacing="sm">
            {monthly
              .sort((a, b) => {
                const yearCompare = (b.period_year || 0) - (a.period_year || 0);
                if (yearCompare !== 0) return yearCompare;
                return (b.period_month || 0) - (a.period_month || 0);
              })
              .map((goal) => (
                <GoalCard key={goal.id} goal={goal} onDelete={onDelete} />
              ))}
          </Stack>
        </Stack>
      )}

      {yearly.length > 0 && (
        <Stack spacing="sm">
          <Heading level={3} className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-accent-secondary" />
            <span>Yearly Goals</span>
          </Heading>
          <Stack spacing="sm">
            {yearly
              .sort((a, b) => (b.period_year || 0) - (a.period_year || 0))
              .map((goal) => (
                <GoalCard key={goal.id} goal={goal} onDelete={onDelete} />
              ))}
          </Stack>
        </Stack>
      )}

      {daily.length > 0 && (
        <Stack spacing="sm">
          <Heading level={3} className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-semantic-success" />
            <span>Daily Goals</span>
          </Heading>
          <Stack spacing="sm">
            {daily.map((goal) => (
              <GoalCard key={goal.id} goal={goal} onDelete={onDelete} />
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}

