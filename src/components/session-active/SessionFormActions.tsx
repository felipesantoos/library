import { Button } from '@/components/ui/Button';
import { Save } from 'lucide-react';

interface SessionFormActionsProps {
  loading: boolean;
  disabled: boolean;
}

export function SessionFormActions({ loading, disabled }: SessionFormActionsProps) {
  return (
    <div className="flex items-center justify-end pt-4">
      <Button
        type="submit"
        variant="primary"
        disabled={disabled || loading}
        loading={loading}
        icon={<Save />}
        iconPosition="left"
      >
        {loading ? 'Saving...' : 'Save Session'}
      </Button>
    </div>
  );
}

