import { useNavigate } from 'react-router-dom';
import { Heading, Paragraph } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Plus } from 'lucide-react';

interface CollectionsHeaderProps {
  onNewCollectionClick: () => void;
}

export function CollectionsHeader({ onNewCollectionClick }: CollectionsHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          size="sm"
          iconOnly
          icon={<ArrowLeft className="w-5 h-5" />}
          aria-label="Back"
        />
        <div>
          <Heading level={1}>Collections</Heading>
          <Paragraph variant="secondary" className="mt-2">
            Organize your books into collections
          </Paragraph>
        </div>
      </div>
      <Button
        onClick={onNewCollectionClick}
        variant="primary"
        icon={<Plus />}
        iconPosition="left"
      >
        New Collection
      </Button>
    </div>
  );
}

