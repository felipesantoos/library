import { Heading, Paragraph } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

interface NotesHeaderProps {
  notesCount: number;
  onNewNoteClick: () => void;
}

export function NotesHeader({ notesCount, onNewNoteClick }: NotesHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Heading level={1}>Notes</Heading>
        <Paragraph variant="secondary" className="mt-2">
          {notesCount} {notesCount === 1 ? 'note' : 'notes'} recorded
        </Paragraph>
      </div>
      <Button
        onClick={onNewNoteClick}
        variant="primary"
        icon={<Plus />}
        iconPosition="left"
      >
        New Note
      </Button>
    </div>
  );
}

