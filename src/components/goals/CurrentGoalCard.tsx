import { Section, Stack } from '@/components/ui/layout';
import { Heading, Paragraph, MetaText } from '@/components/ui/typography';
import { ProgressBar } from '@/components/ui/data-display';
import { BookOpen, Trophy, Clock } from 'lucide-react';
import { GoalDto } from '@/hooks/useGoals';
import { cn } from '@/lib/utils';

interface CurrentGoalCardProps {
  goal: GoalDto;
  type: 'monthly' | 'yearly' | 'daily';
  periodLabel: string;
}

export function CurrentGoalCard({ goal, type, periodLabel }: CurrentGoalCardProps) {
  const config = {
    monthly: {
      icon: BookOpen,
      title: 'Monthly Pages',
      iconColor: 'text-accent-primary',
      bgColor: 'bg-accent-primary/10',
      borderColor: 'border-accent-primary/30',
    },
    yearly: {
      icon: Trophy,
      title: 'Yearly Books',
      iconColor: 'text-accent-secondary',
      bgColor: 'bg-accent-secondary/10',
      borderColor: 'border-accent-secondary/30',
    },
    daily: {
      icon: Clock,
      title: 'Daily Minutes',
      iconColor: 'text-semantic-success',
      bgColor: 'bg-semantic-success/10',
      borderColor: 'border-semantic-success/30',
    },
  };

  const { icon: Icon, title, iconColor, bgColor, borderColor } = config[type];

  return (
    <Section padding="md" className={cn(bgColor, borderColor)}>
      <Stack spacing="sm">
        <div className="flex items-center space-x-2">
          <Icon className={cn("w-5 h-5", iconColor)} />
          <Heading level={4} className="text-base">{title}</Heading>
        </div>
        <MetaText className="text-xs">{periodLabel}</MetaText>
        <ProgressBar
          value={goal.progress_percentage}
          label={
            type === 'monthly'
              ? `${goal.current_progress} / ${goal.target_value} pages`
              : type === 'yearly'
              ? `${goal.current_progress} / ${goal.target_value} books`
              : `${goal.current_progress} / ${goal.target_value} minutes`
          }
          size="md"
        />
        <Paragraph variant="secondary" className="text-xs">
          {Math.round(goal.progress_percentage)}% complete
        </Paragraph>
      </Stack>
    </Section>
  );
}

