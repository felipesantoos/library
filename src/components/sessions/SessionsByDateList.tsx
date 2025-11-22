import { SessionDto } from '@/hooks/useSessions';
import { BookDto } from '@/hooks/useBooks';
import { Stack } from '@/components/ui/layout';
import { MetaText } from '@/components/ui/typography';
import { SessionCard } from './SessionCard';
import { formatDate } from './utils/dateUtils';

interface SessionsByDateListProps {
  sessionsByDate: Record<string, SessionDto[]>;
  books: BookDto[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function SessionsByDateList({
  sessionsByDate,
  books,
  onEdit,
  onDelete,
}: SessionsByDateListProps) {
  return (
    <Stack spacing="md">
      {Object.entries(sessionsByDate)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .map(([date, dateSessions]) => (
          <div key={date}>
            <MetaText className="mb-2 block">{formatDate(date)}</MetaText>
            <Stack spacing="sm">
              {dateSessions.map((session) => {
                const book = books.find((b) => b.id === session.book_id);
                return (
                  <SessionCard
                    key={session.id}
                    session={session}
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

