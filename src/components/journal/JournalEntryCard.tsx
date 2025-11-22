import { JournalEntryDto } from '@/hooks/useJournalEntries';
import { BookDto } from '@/hooks/useBooks';
import { Section, Stack } from '@/components/ui/layout';
import { Paragraph, MetaText } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';
import { BookOpen, Edit2, Trash2 } from 'lucide-react';

interface JournalEntryCardProps {
  entry: JournalEntryDto;
  book: BookDto | null;
  onEdit: (entry: JournalEntryDto) => void;
  onDelete: (id: number) => void;
}

export function JournalEntryCard({ entry, book, onEdit, onDelete }: JournalEntryCardProps) {
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const contentPreview = entry.content.length > 200
    ? entry.content.substring(0, 200) + '...'
    : entry.content;

  return (
    <Section padding="md" className="hover:shadow-medium transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Stack spacing="sm">
            {book && (
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-accent-primary" />
                <Paragraph className="text-sm font-medium text-accent-primary">
                  {book.title}
                </Paragraph>
              </div>
            )}
            <Paragraph className="whitespace-pre-wrap">{contentPreview}</Paragraph>
            <MetaText className="text-xs">
              {formatTime(entry.created_at)}
              {entry.updated_at !== entry.created_at && ' (edited)'}
            </MetaText>
          </Stack>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <Button
            onClick={() => onEdit(entry)}
            variant="ghost"
            size="sm"
            iconOnly
            icon={<Edit2 className="w-4 h-4" />}
            aria-label="Edit entry"
          />
          {entry.id && (
            <Button
              onClick={() => onDelete(entry.id!)}
              variant="ghost"
              size="sm"
              iconOnly
              icon={<Trash2 className="w-4 h-4" />}
              aria-label="Delete entry"
            />
          )}
        </div>
      </div>
    </Section>
  );
}

