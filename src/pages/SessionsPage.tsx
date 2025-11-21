import React, { useState } from 'react';
import { useSessions, SessionDto } from '@/hooks/useSessions';
import { useBooks } from '@/hooks/useBooks';
import { Container, Stack, Section } from '@/components/ui/layout';
import { Heading, Paragraph, MetaText } from '@/components/ui/typography';
import { Clock, BookOpen, Calendar, Trash2, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { deleteSession } from '@/hooks/useSessions';

export function SessionsPage() {
  const [bookFilter, setBookFilter] = useState<number | null>(null);
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  
  const { books } = useBooks({});
  
  const today = new Date().toISOString().split('T')[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const dateFilters = {
    all: { start_date: undefined, end_date: undefined },
    today: { start_date: today, end_date: today },
    week: { start_date: weekAgo, end_date: today },
    month: { start_date: monthAgo, end_date: today },
  };

  const { sessions, loading, error, refresh } = useSessions({
    book_id: bookFilter ?? undefined,
    ...dateFilters[dateFilter],
  });

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this session?')) {
      try {
        await deleteSession(id);
        refresh();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete session');
      }
    }
  };

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

  // Group sessions by date
  const sessionsByDate = sessions.reduce((acc, session) => {
    const date = session.session_date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(session);
    return acc;
  }, {} as Record<string, SessionDto[]>);

  return (
    <Container>
      <div className="py-8">
        <Stack spacing="lg">
          {/* Header */}
          <div>
            <Heading level={1}>Reading Logbook</Heading>
            <Paragraph variant="secondary" className="mt-2">
              {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'} recorded
            </Paragraph>
          </div>

          {/* Filters */}
          <Section padding="sm">
            <Stack direction="row" spacing="md" className="flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Book
                </label>
                <select
                  value={bookFilter || ''}
                  onChange={(e) => setBookFilter(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                >
                  <option value="">All Books</option>
                  {books.map((book) => (
                    <option key={book.id} value={book.id || 0}>
                      {book.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Date Range
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>
            </Stack>
          </Section>

          {/* Sessions List */}
          {sessions.length === 0 ? (
            <Section padding="lg">
              <div className="text-center py-12">
                <Clock className="w-16 h-16 mx-auto text-text-secondary mb-4" />
                <Heading level={3}>No sessions recorded</Heading>
                <Paragraph variant="secondary" className="mt-2">
                  Start a reading session to track your progress
                </Paragraph>
              </div>
            </Section>
          ) : (
            <Stack spacing="md">
              {Object.entries(sessionsByDate)
                .sort((a, b) => b[0].localeCompare(a[0]))
                .map(([date, dateSessions]) => (
                  <div key={date}>
                    <MetaText className="mb-2 block">{formatDate(date)}</MetaText>
                    <Stack spacing="sm">
                      {dateSessions.map((session) => (
                        <SessionCard
                          key={session.id}
                          session={session}
                          books={books}
                          onDelete={handleDelete}
                          onEdit={(id) => navigate(`/session/${id}/edit`)}
                        />
                      ))}
                    </Stack>
                  </div>
                ))}
            </Stack>
          )}
        </Stack>
      </div>
    </Container>
  );
}

function SessionCard({
  session,
  books,
  onDelete,
  onEdit,
}: {
  session: SessionDto;
  books: any[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}) {
  const book = books.find((b) => b.id === session.book_id);

  return (
    <Section padding="md" className="hover:shadow-medium transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Stack spacing="sm">
            <div className="flex items-center space-x-3">
              {book ? (
                <>
                  <BookOpen className="w-5 h-5 text-text-secondary" />
                  <div>
                    <Heading level={4} className="text-base">
                      {book.title}
                    </Heading>
                    {book.author && (
                      <Paragraph variant="secondary" className="text-sm mt-0">
                        {book.author}
                      </Paragraph>
                    )}
                  </div>
                </>
              ) : (
                <Paragraph variant="secondary">Book not found</Paragraph>
              )}
            </div>

            <div className="flex items-center space-x-4 text-sm text-text-secondary">
              {session.start_time && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {session.start_time.substring(0, 5)}
                    {session.end_time && ` - ${session.end_time.substring(0, 5)}`}
                  </span>
                </div>
              )}

              {session.duration_formatted && (
                <span>Duration: {session.duration_formatted}</span>
              )}

              {session.pages_read && session.pages_read > 0 && (
                <span>Pages: {session.start_page} → {session.end_page} ({session.pages_read} pages)</span>
              )}

              {session.minutes_read && session.minutes_read > 0 && (
                <span>Minutes: {session.minutes_read}</span>
              )}
            </div>

            {session.notes && (
              <Paragraph variant="secondary" className="text-sm italic">
                "{session.notes}"
              </Paragraph>
            )}
          </Stack>
        </div>

        {session.id && (
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onEdit(session.id!)}
              className="p-2 text-text-secondary hover:text-accent-primary transition-colors"
              aria-label="Edit session"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(session.id!)}
              className="p-2 text-text-secondary hover:text-semantic-error transition-colors"
              aria-label="Delete session"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </Section>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateStr === today.toISOString().split('T')[0]) {
    return 'Today';
  }
  if (dateStr === yesterday.toISOString().split('T')[0]) {
    return 'Yesterday';
  }

  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

