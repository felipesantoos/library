import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessions } from '@/hooks/useSessions';
import { useBooks } from '@/hooks/useBooks';
import { Container, Stack } from '@/components/ui/layout';
import { Paragraph } from '@/components/ui/typography';
import {
  SessionsHeader,
  SessionsFilters,
  SessionsEmptyState,
  SessionsByDateList,
  useSessionsByDate,
  useSessionDateFilters,
  useSessionActions,
  DateFilter,
} from '@/components/sessions';

export function SessionsPage() {
  const navigate = useNavigate();
  const [bookFilter, setBookFilter] = useState<number | null>(null);
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');

  const { books } = useBooks({});
  const dateFilters = useSessionDateFilters(dateFilter);

  const { sessions, loading, error, refresh } = useSessions({
    book_id: bookFilter ?? undefined,
    ...dateFilters,
  });

  const sessionsByDate = useSessionsByDate(sessions);
  const { handleDelete } = useSessionActions({ onRefresh: refresh });

  if (loading) {
    return (
      <Container>
        <div className="py-8">
          <Paragraph>Loading sessions...</Paragraph>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="py-8">
          <Paragraph variant="secondary" className="text-semantic-error">
            Error: {error}
          </Paragraph>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <Stack spacing="lg">
          <SessionsHeader sessionsCount={sessions.length} />

          <SessionsFilters
            books={books}
            bookFilter={bookFilter}
            dateFilter={dateFilter}
            onBookFilterChange={setBookFilter}
            onDateFilterChange={setDateFilter}
          />

          {sessions.length === 0 ? (
            <SessionsEmptyState />
          ) : (
            <SessionsByDateList
              sessionsByDate={sessionsByDate}
              books={books}
              onEdit={(id) => navigate(`/session/${id}/edit`)}
              onDelete={handleDelete}
            />
          )}
        </Stack>
      </div>
    </Container>
  );
}
