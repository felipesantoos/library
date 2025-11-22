import { useNavigate } from 'react-router-dom';
import { Heading, Paragraph } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressCorrectionHeaderProps {
  bookTitle: string;
  bookId: number;
  hasChanges: boolean;
  hasErrors: boolean;
  saving: boolean;
  onSave: () => void;
}

export function ProgressCorrectionHeader({
  bookTitle,
  bookId,
  hasChanges,
  hasErrors,
  saving,
  onSave,
}: ProgressCorrectionHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button
          onClick={() => navigate(`/book/${bookId}`)}
          variant="ghost"
          size="sm"
          iconOnly
          icon={<ArrowLeft className="w-5 h-5" />}
          aria-label="Back to book"
        />
        <div>
          <Heading level={1}>Progress Correction</Heading>
          <Paragraph variant="secondary" className="mt-1">
            {bookTitle}
          </Paragraph>
        </div>
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
  );
}

