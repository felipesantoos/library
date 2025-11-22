import { useParams } from 'react-router-dom';
import { useSession } from '@/hooks/useSessions';
import { useBooks } from '@/hooks/useBooks';
import { UpdateSessionCommand } from '@/hooks/useSessions';
import { Container, Stack } from '@/components/ui/layout';
import { Paragraph } from '@/components/ui/typography';
import {
  SessionEditHeader,
  SessionEditBookInfo,
  SessionEditError,
  SessionEditForm,
  useSessionEditForm,
  useSessionEditSubmit,
} from '@/components/session-edit';

export function SessionEditPage() {
  const { id } = useParams<{ id: string }>();
  const sessionId = id ? parseInt(id) : null;

  const { session, loading, error } = useSession(sessionId);
  const { books } = useBooks({});

  const {
    sessionDate,
    startTime,
    endTime,
    startPage,
    endPage,
    minutesRead,
    notes,
    setSessionDate,
    setStartTime,
    setEndTime,
    setStartPage,
    setEndPage,
    setMinutesRead,
    setNotes,
  } = useSessionEditForm({ session });

  const selectedBook = books.find((b) => b.id === session?.book_id);

  const { handleSubmit, loading: saving, error: formError } = useSessionEditSubmit({
    sessionId: sessionId!,
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sessionId) {
      handleSubmit({} as UpdateSessionCommand, () => 'Session ID is required');
      return;
    }

    const validate = () => {
      if (startPage !== null && endPage !== null && endPage < startPage) {
        return 'End page cannot be less than start page';
      }
      return null;
    };

    const command: UpdateSessionCommand = {
      id: sessionId,
      session_date: sessionDate,
      start_time: startTime || null,
      end_time: endTime || null,
      start_page: startPage,
      end_page: endPage,
      minutes_read: minutesRead,
      notes: notes || null,
    };

    handleSubmit(command, validate);
  };

  if (loading) {
    return (
      <Container>
        <div className="py-8">
          <Paragraph>Loading session...</Paragraph>
        </div>
      </Container>
    );
  }

  if (error || !session) {
    return (
      <Container>
        <div className="py-8">
          <Paragraph variant="secondary" className="text-semantic-error">
            Error: {error || 'Session not found'}
          </Paragraph>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <Stack spacing="lg">
          <SessionEditHeader />

          {selectedBook && <SessionEditBookInfo book={selectedBook} />}

          {formError && <SessionEditError error={formError} />}

          <SessionEditForm
            selectedBook={selectedBook || null}
            sessionDate={sessionDate}
            startTime={startTime}
            endTime={endTime}
            startPage={startPage}
            endPage={endPage}
            minutesRead={minutesRead}
            notes={notes}
            loading={saving}
            onSessionDateChange={setSessionDate}
            onStartTimeChange={setStartTime}
            onEndTimeChange={setEndTime}
            onStartPageChange={setStartPage}
            onEndPageChange={setEndPage}
            onMinutesReadChange={setMinutesRead}
            onNotesChange={setNotes}
            onSubmit={onSubmit}
          />
        </Stack>
      </div>
    </Container>
  );
}
