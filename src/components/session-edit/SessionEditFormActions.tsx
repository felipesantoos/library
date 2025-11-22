import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Save } from 'lucide-react';

interface SessionEditFormActionsProps {
  loading: boolean;
}

export function SessionEditFormActions({ loading }: SessionEditFormActionsProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-end space-x-3 pt-4">
      <Button
        type="button"
        onClick={() => navigate('/sessions')}
        variant="outline"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        variant="primary"
        disabled={loading}
        loading={loading}
        icon={<Save />}
        iconPosition="left"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
}

