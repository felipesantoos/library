import { Section } from '@/components/ui/layout';
import { Paragraph } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';
import { RotateCcw } from 'lucide-react';

interface ProgressActionsProps {
  editedSessionsCount: number;
  deletingSessionsCount: number;
  onRecalculateProgress: () => void;
}

export function ProgressActions({
  editedSessionsCount,
  deletingSessionsCount,
  onRecalculateProgress,
}: ProgressActionsProps) {
  return (
    <Section padding="md" className="border-t border-background-border">
      <div className="flex items-center justify-between">
        <Button
          onClick={onRecalculateProgress}
          variant="outline"
          icon={<RotateCcw />}
          iconPosition="left"
        >
          Recalculate Progress
        </Button>
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          {editedSessionsCount > 0 && (
            <span>{editedSessionsCount} session(s) modified</span>
          )}
          {deletingSessionsCount > 0 && (
            <span className="text-semantic-error">
              {deletingSessionsCount} session(s) marked for deletion
            </span>
          )}
        </div>
      </div>
    </Section>
  );
}

