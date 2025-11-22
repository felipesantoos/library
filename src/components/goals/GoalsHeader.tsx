import { Heading, Paragraph } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

interface GoalsHeaderProps {
  onNewGoalClick: () => void;
}

export function GoalsHeader({ onNewGoalClick }: GoalsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Heading level={1}>Goals</Heading>
        <Paragraph variant="secondary" className="mt-2">
          Track your reading goals and statistics
        </Paragraph>
      </div>
      <Button
        onClick={onNewGoalClick}
        variant="primary"
        icon={<Plus />}
        iconPosition="left"
      >
        New Goal
      </Button>
    </div>
  );
}

