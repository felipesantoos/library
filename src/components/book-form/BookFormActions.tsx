import { Button } from '@/components/ui/Button';
import { Save } from 'lucide-react';

interface BookFormActionsProps {
  loading: boolean;
}

export function BookFormActions({ loading }: BookFormActionsProps) {
  return (
    <div className="flex items-center justify-end pt-4">
      <Button
        type="submit"
        variant="primary"
        disabled={loading}
        loading={loading}
        icon={<Save className="w-4 h-4" />}
        iconPosition="left"
      >
        {loading ? 'Saving...' : 'Save'}
      </Button>
    </div>
  );
}

