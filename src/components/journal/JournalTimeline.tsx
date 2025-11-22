import { JournalEntryDto } from '@/hooks/useJournalEntries';
import { BookDto } from '@/hooks/useBooks';
import { Stack } from '@/components/ui/layout';
import { Heading } from '@/components/ui/typography';
import { Calendar } from 'lucide-react';
import { JournalEntryCard } from './JournalEntryCard';

interface JournalTimelineProps {
  entriesByDate: Map<string, JournalEntryDto[]>;
  books: BookDto[];
  onEdit: (entry: JournalEntryDto) => void;
  onDelete: (id: number) => void;
}

export function JournalTimeline({ entriesByDate, books, onEdit, onDelete }: JournalTimelineProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Stack spacing="lg">
      {Array.from(entriesByDate.entries())
        .sort((a, b) => b[0].localeCompare(a[0])) // Sort dates descending
        .map(([date, dateEntries]) => (
          <div key={date}>
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="w-5 h-5 text-accent-primary" />
              <Heading level={3} className="text-base">
                {formatDate(date)}
              </Heading>
            </div>
            <Stack spacing="sm">
              {dateEntries.map((entry) => {
                const book = entry.book_id
                  ? books.find((b) => b.id === entry.book_id)
                  : null;
                
                return (
                  <JournalEntryCard
                    key={entry.id}
                    entry={entry}
                    book={book || null}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                );
              })}
            </Stack>
          </div>
        ))}
    </Stack>
  );
}

