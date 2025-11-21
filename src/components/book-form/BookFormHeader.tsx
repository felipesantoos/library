import { useNavigate } from 'react-router-dom';
import { Heading } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

interface BookFormHeaderProps {
  isEditing: boolean;
}

export function BookFormHeader({ isEditing }: BookFormHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center space-x-4">
      <Button
        onClick={() => navigate('/library')}
        variant="ghost"
        size="sm"
        iconOnly
        icon={<ArrowLeft className="w-5 h-5" />}
        aria-label="Back to library"
      />
      <Heading level={1}>
        {isEditing ? 'Edit Book' : 'Add New Book'}
      </Heading>
    </div>
  );
}

