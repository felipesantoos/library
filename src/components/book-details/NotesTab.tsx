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
            <div className="flex items-center space-x-2">
              {note.note_type === 'highlight' && (
                <div className="w-2 h-2 rounded-full bg-accent-secondary" />
              )}
              <MetaText className="text-xs">
                {note.page && `Page ${note.page} • `}
                {new Date(note.created_at).toLocaleDateString()}
              </MetaText>
            </div>
            {note.excerpt && (
              <div className="p-3 rounded-md bg-background-surface border-l-4 border-accent-secondary">
                <Paragraph variant="secondary" className="text-sm italic">
                  "{note.excerpt}"
                </Paragraph>
              </div>
            )}
            <Paragraph className="text-sm">{note.content}</Paragraph>
          </Stack>
        </Section>
      ))}
    </Stack>
  );
}

