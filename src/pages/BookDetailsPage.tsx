import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBook } from '@/hooks/useBooks';
import { useSessions } from '@/hooks/useSessions';
import { useNotes } from '@/hooks/useNotes';
import { useTags } from '@/hooks/useTags';
import { useCollections } from '@/hooks/useCollections';
import { useReadings, useCurrentReading } from '@/hooks/useReadings';
import { useBookSummary } from '@/hooks/useBookSummary';
import { Container, Stack } from '@/components/ui/layout';
import { Paragraph } from '@/components/ui/typography';
import {
  BookDetailsHeader,
  BookCover,
  BookInfoSection,
  BookTabs,
  OverviewTab,
  SessionsTab,
  NotesTab,
  SummaryTab,
  useBookProgressData,
  BookTab,
} from '@/components/book-details';

export function BookDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract ID from pathname manually since we're not using Routes/Route
  const extractId = (pathname: string): string | null => {
    const match = pathname.match(/\/book\/(\d+)/);
    return match ? match[1] : null;
  };
  
  const id = extractId(location.pathname);
  const bookId = id ? parseInt(id, 10) : null;
  
  // Validate that bookId is a valid number
  if (id && (isNaN(bookId as number) || bookId === null)) {
    return (
      <Container>
        <div className="py-8">
          <Paragraph variant="secondary" className="text-semantic-error">
            Error: Invalid book ID
          </Paragraph>
        </div>
      </Container>
    );
  }

  const { book, loading, error, refresh } = useBook(bookId);
  const { sessions } = useSessions({ book_id: bookId ?? undefined });
  const { notes, refresh: refreshNotes } = useNotes({ book_id: bookId ?? undefined });
  const { tags } = useTags(bookId ?? undefined);
  const { collections } = useCollections(bookId ?? undefined);
  const { readings, refresh: refreshReadings } = useReadings(bookId);
  const { refresh: refreshCurrentReading } = useCurrentReading(bookId);
  const { summary, loading: summaryLoading, error: summaryError } = useBookSummary(bookId);

  const [activeTab, setActiveTab] = useState<BookTab>('overview');
  const [selectedReadingId, setSelectedReadingId] = useState<number | null>(null);

  // Sort sessions by date (newest first)
  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => 
      b.session_date.localeCompare(a.session_date)
    );
  }, [sessions]);

  // Filter sessions by selected reading (if any)
  const filteredSessions = useMemo(() => {
    if (selectedReadingId === null) {
      return sortedSessions;
    }
    return sortedSessions.filter(s => s.reading_id === selectedReadingId);
  }, [sortedSessions, selectedReadingId]);

  // Calculate progress data (hook handles null book)
  const progressData = useBookProgressData(book, sessions);

  if (loading) {
    return (
      <Container>
        <div className="py-8">
          <Paragraph>Loading book...</Paragraph>
        </div>
      </Container>
    );
  }

  if (error || !book || !book.id) {
    return (
      <Container>
        <div className="py-8">
          <Paragraph variant="secondary" className="text-semantic-error">
            Error: {error || 'Book not found'}
          </Paragraph>
        </div>
      </Container>
    );
  }

  const handleEditSession = (sessionId: number) => {
    navigate(`/session/${sessionId}/edit`);
  };

  return (
    <Container>
      <div className="py-8">
        <Stack spacing="lg">
          <BookDetailsHeader book={book} onRefresh={refresh} />

          {/* Book Cover & Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BookCover book={book} />
            <BookInfoSection
              book={book}
              tags={tags}
              collections={collections}
              readings={readings}
              sessions={sessions}
              selectedReadingId={selectedReadingId}
              onSelectReading={setSelectedReadingId}
              onRefresh={refresh}
              onRefreshReadings={refreshReadings}
              onRefreshCurrentReading={refreshCurrentReading}
              onNoteCreated={refreshNotes}
            />
          </div>

          <BookTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            sessionsCount={sessions.length}
            filteredSessionsCount={filteredSessions.length}
            notesCount={notes.length}
            selectedReadingId={selectedReadingId}
          />

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <OverviewTab
              book={book}
              sessions={sessions}
              notesCount={notes.length}
              progressData={progressData}
            />
          )}

          {activeTab === 'sessions' && (
            <SessionsTab
              book={book}
              sessions={filteredSessions}
              onEdit={handleEditSession}
            />
          )}

          {activeTab === 'notes' && (
            <NotesTab 
              notes={notes} 
              bookId={book.id!}
              onNoteCreated={refreshNotes}
              onNoteUpdated={refreshNotes}
              onNoteDeleted={refreshNotes}
            />
          )}

          {activeTab === 'summary' && (
            <SummaryTab
              summary={summary}
              loading={summaryLoading}
              error={summaryError}
            />
          )}
        </Stack>
      </div>
    </Container>
  );
}
