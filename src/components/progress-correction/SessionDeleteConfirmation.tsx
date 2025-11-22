import { SessionDto } from '@/hooks/useSessions';
import { Section } from '@/components/ui/layout';
import { Paragraph } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';

interface SessionDeleteConfirmationProps {
  session: SessionDto;
  onConfirm: () => void;
  onCancel: () => void;
}

export function SessionDeleteConfirmation({
  session,
  onConfirm,
  onCancel,
}: SessionDeleteConfirmationProps) {
  return (
    <Section padding="md" className="border-2 border-semantic-error bg-semantic-error/10">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Paragraph className="font-medium text-semantic-error">
            Delete session from {new Date(session.session_date).toLocaleDateString()}?
          </Paragraph>
          <Paragraph variant="secondary" className="text-sm mt-1">
            This will recalculate book progress.
          </Paragraph>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Button
            onClick={onCancel}
            variant="outline"
            size="sm"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="secondary"
            size="sm"
            className="bg-semantic-error hover:bg-semantic-error/90"
          >
            Delete
          </Button>
        </div>
      </div>
    </Section>
  );
}

