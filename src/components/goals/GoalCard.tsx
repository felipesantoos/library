import { GoalDto } from '@/hooks/useGoals';
import { Section, Stack } from '@/components/ui/layout';
import { Heading, MetaText } from '@/components/ui/typography';
import { ProgressBar } from '@/components/ui/data-display';
import { Button } from '@/components/ui/Button';
import { BookOpen, Trophy, Clock, Target, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoalCardProps {
  goal: GoalDto;
  onDelete: (id: number) => void;
}

export function GoalCard({ goal, onDelete }: GoalCardProps) {
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

        {goal.id !== null && (
          <Button
            onClick={() => onDelete(goal.id!)}
            variant="ghost"
            size="sm"
            iconOnly
            icon={<Trash2 className="w-4 h-4" />}
            aria-label="Delete goal"
            className="ml-4"
          />
        )}
      </div>
    </Section>
  );
}

