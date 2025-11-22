import { useNavigate } from 'react-router-dom';
import { Heading } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export function SessionActiveHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center space-x-4">
      <Button
        onClick={() => navigate('/sessions')}
        variant="ghost"
        size="sm"
        iconOnly
        icon={<ArrowLeft className="w-5 h-5" />}
        aria-label="Back to sessions"
      />
      <Heading level={1}>New Reading Session</Heading>
    </div>
  );
}

