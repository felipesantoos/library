import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Plus, Play } from 'lucide-react';

export function TopBarActions() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center space-x-3 ml-4">
      <Button
        onClick={() => navigate('/session/new')}
        variant="primary"
        showBorder={false}
        icon={<Play />}
        iconPosition="left"
        title="Start a new reading session"
      >
        <span className="hidden sm:inline">Start Session</span>
      </Button>
      <Button
        onClick={() => navigate('/book/new')}
        variant="primary"
        showBorder={false}
        icon={<Plus />}
        iconPosition="left"
      >
        <span className="hidden sm:inline">Add Book</span>
      </Button>
    </div>
  );
}

