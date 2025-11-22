import { Stack, Section } from '@/components/ui/layout';
import { MetaText, Paragraph } from '@/components/ui/typography';
import { EmptyState } from './EmptyState';
import { NoteDto } from '@/hooks/useNotes';

interface NotesTabProps {
  notes: NoteDto[];
}

export function NotesTab({ notes }: NotesTabProps) {
  if (notes.length === 0) {
    return <EmptyState type="notes" />;
  }

  return (
    <Stack spacing="sm">
      {notes.map((note) => (
        <Section key={note.id || Math.random()} padding="md" className="hover:shadow-medium transition-shadow">
          <Stack spacing="sm">
            <MetaText className="text-xs">
              {note.page && `Page ${note.page} • `}
              {new Date(note.created_at).toLocaleDateString()}
            </MetaText>
            <Paragraph className="text-sm">{note.content}</Paragraph>
          </Stack>
        </Section>
      ))}
    </Stack>
  );
}

