import { Heading, Paragraph } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

interface JournalHeaderProps {
  onNewEntryClick: () => void;
}

export function JournalHeader({ onNewEntryClick }: JournalHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Heading level={1}>Reading Journal</Heading>
        <Paragraph variant="secondary" className="mt-2">
          Reflect on your reading journey
        </Paragraph>
      </div>
      <Button
        onClick={onNewEntryClick}
        variant="primary"
        icon={<Plus />}
        iconPosition="left"
      >
        New Entry
      </Button>
    </div>
  );
}

