import { Section, Stack } from '@/components/ui/layout';
import { Heading, Paragraph } from '@/components/ui/typography';
import { ProgressBar } from '@/components/ui/data-display';
import { Target } from 'lucide-react';

interface MonthlyGoalPanelProps {
  goal: number;
  progress: number;
}

export function MonthlyGoalPanel({ goal, progress }: MonthlyGoalPanelProps) {
  const percentage = (progress / goal) * 100;

  return (
    <Section padding="md">
      <Stack spacing="sm">
        <div className="flex items-center justify-between">
          <Heading level={4}>This Month</Heading>
          <Target className="w-5 h-5 text-text-secondary dark:text-dark-text-secondary" />
        </div>
        
        <ProgressBar
          value={percentage}
          label={`${progress} / ${goal} pages`}
          size="md"
        />
        
        <Paragraph variant="secondary" className="text-sm">
          {goal - progress} pages remaining
        </Paragraph>
      </Stack>
    </Section>
  );
}

