import { Section } from '@/components/ui/layout';
import { Button } from '@/components/ui/Button';
import { Save } from 'lucide-react';

interface ProgressActionsProps {
  editedSessionsCount: number;
  deletingSessionsCount: number;
  hasChanges: boolean;
  hasErrors: boolean;
  saving: boolean;
  onSave: () => void;
}

export function ProgressActions({
  editedSessionsCount,
  deletingSessionsCount,
  hasChanges,
  hasErrors,
  saving,
  onSave,
}: ProgressActionsProps) {
  // Only render if there are changes or information to show
  if (!hasChanges && editedSessionsCount === 0 && deletingSessionsCount === 0) {
    return null;
  }

  return (
    <Section padding="md" className="border-t border-background-border">
      <div className="flex items-center justify-between">
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
        {hasChanges && (
          <Button
            onClick={onSave}
            disabled={saving || hasErrors}
            variant={hasErrors ? 'secondary' : 'primary'}
            loading={saving}
            icon={<Save />}
            iconPosition="left"
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </Button>
        )}
      </div>
    </Section>
  );
}

