import { useLocation } from 'react-router-dom';
import { useBook } from '@/hooks/useBooks';
import { useSessions, deleteSession } from '@/hooks/useSessions';
import { Container, Stack } from '@/components/ui/layout';
import { Paragraph } from '@/components/ui/typography';
import { useState, useEffect } from 'react';
import {
  ProgressCorrectionHeader,
  ProgressCorrectionInfo,
  ProgressStatistics,
  SessionsList,
  EmptySessionsState,
  ProgressActions,
  useSessionValidation,
  useSessionEditing,
  useProgressCorrectionActions,
} from '@/components/progress-correction';

export function ProgressCorrectionPage() {
  const location = useLocation();
  
  // Extract ID from pathname manually since we're not using Routes/Route
  const extractId = (pathname: string): string | null => {
    const match = pathname.match(/\/book\/(\d+)\/progress-correction/);
    return match ? match[1] : null;
  };
  
  const id = extractId(location.pathname);
  const bookId = id ? parseInt(id) : null;

  const { book, loading: loadingBook, error: bookError } = useBook(bookId);
  const { sessions, loading: loadingSessions, refresh } = useSessions({
    book_id: bookId ?? undefined,
  });

  const [errors, setErrors] = useState<Map<number, string>>(new Map());
  const [warnings, setWarnings] = useState<Map<number, string>>(new Map());

  const { errors: validationErrors, warnings: validationWarnings } = useSessionValidation(sessions, book);
  
  // Update errors and warnings when validation changes
  useEffect(() => {
    setErrors(validationErrors);
    setWarnings(validationWarnings);
  }, [validationErrors, validationWarnings]);

  const {
    editingSessions,
    deletingSessions,
    sortedSessions,
    handleEditSession,
    handleDeleteSession,
    handleCancelDelete,
    clearEditing,
  } = useSessionEditing(sessions, setErrors);

  const { handleSaveAll, handleRecalculateProgress, saving } = useProgressCorrectionActions({
    editingSessions,
    deletingSessions,
    errors,
    bookId: bookId!,
    onRefresh: refresh,
    onClearEditing: clearEditing,
  });

  const handleConfirmDelete = async (sessionId: number) => {
    try {
      await deleteSession(sessionId);
      await refresh();
      handleCancelDelete(sessionId);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete session');
    }
  };

  const hasChanges = editingSessions.size > 0 || deletingSessions.size > 0;
  const hasErrors = errors.size > 0;

  if (loadingBook || loadingSessions) {
    return (
      <Container>
        <div className="py-8">
          <Paragraph>Loading...</Paragraph>
        </div>
      </Container>
    );
  }

  if (bookError || !book || !bookId) {
    return (
      <Container>
        <div className="py-8">
          <Paragraph variant="secondary" className="text-semantic-error">
            Error: {bookError || 'Book not found'}
          </Paragraph>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <Stack spacing="lg">
          <ProgressCorrectionHeader
            bookTitle={book.title}
            bookId={bookId}
            hasChanges={hasChanges}
            hasErrors={hasErrors}
            saving={saving}
            onSave={handleSaveAll}
          />

          <ProgressCorrectionInfo hasErrors={hasErrors} />

          <ProgressStatistics sessions={sortedSessions} book={book} />

          {sortedSessions.length === 0 ? (
            <EmptySessionsState />
          ) : (
            <SessionsList
              sessions={sortedSessions}
              book={book}
              editingSessions={editingSessions}
              deletingSessions={deletingSessions}
              errors={errors}
              warnings={warnings}
              onEditSession={handleEditSession}
              onDeleteSession={handleDeleteSession}
              onCancelDelete={handleCancelDelete}
              onConfirmDelete={handleConfirmDelete}
            />
          )}

          {sortedSessions.length > 0 && (
            <ProgressActions
              editedSessionsCount={editingSessions.size}
              deletingSessionsCount={deletingSessions.size}
              onRecalculateProgress={handleRecalculateProgress}
            />
          )}
        </Stack>
      </div>
    </Container>
  );
}
