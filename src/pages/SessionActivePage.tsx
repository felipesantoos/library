import { useSearchParams } from 'react-router-dom';
import { useBooks } from '@/hooks/useBooks';
import { CreateSessionCommand } from '@/hooks/useSessions';
import { Container, Stack } from '@/components/ui/layout';
import {
  SessionActiveHeader,
  SessionError,
  SessionTimer,
  SessionForm,
  useSessionTimer,
  useSessionForm,
  useSessionSubmit,
} from '@/components/session-active';
import { useEffect } from 'react';

export function SessionActivePage() {
  const [searchParams] = useSearchParams();
  const bookIdParam = searchParams.get('bookId');
  const initialBookId = bookIdParam ? parseInt(bookIdParam) : null;

  const { books } = useBooks({});
  
  const {
    bookId,
    sessionDate,
    startTime,
    endTime,
    startPage,
    endPage,
    minutesRead,
    notes,
    setBookId,
    setSessionDate,
    setStartTime,
    setEndTime,
    setStartPage,
    setEndPage,
    setMinutesRead,
    setNotes,
  } = useSessionForm({ initialBookId });

  const selectedBook = books.find((b) => b.id === bookId);

  // Auto-set start page when book is selected
  useEffect(() => {
    if (selectedBook && selectedBook.current_page_text > 0) {
      setStartPage((prev) => prev || selectedBook.current_page_text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBook?.id]);

  const { seconds, isRunning, startTimer, pauseTimer, stopTimer } = useSessionTimer(
    () => {
      if (!startTime) {
        const now = new Date();
        setStartTime(now.toTimeString().substring(0, 8));
      }
    },
    (totalSeconds) => {
      const now = new Date();
      setEndTime(now.toTimeString().substring(0, 8));
      if (totalSeconds > 0) {
        const minutes = Math.floor(totalSeconds / 60);
        setMinutesRead(minutes > 0 ? minutes : null);
      }
    }
  );

  const { handleSubmit, loading, error } = useSessionSubmit();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validate = () => {
      if (!bookId) {
        return 'Please select a book';
      }

      if (startPage !== null && endPage !== null && endPage < startPage) {
        return 'End page cannot be less than start page';
      }

      return null;
    };

    const command: CreateSessionCommand = {
      book_id: bookId!,
      session_date: sessionDate,
      start_time: startTime || null,
      end_time: endTime || null,
      start_page: startPage || null,
      end_page: endPage || null,
      minutes_read: minutesRead || null,
      notes: notes || null,
    };

    handleSubmit(command, validate);
  };

  return (
    <Container>
      <div className="py-8">
        <Stack spacing="lg">
          <SessionActiveHeader />

          {error && <SessionError error={error} />}

          <SessionTimer
            seconds={seconds}
            isRunning={isRunning}
            onStart={startTimer}
            onPause={pauseTimer}
            onStop={stopTimer}
          />

          <SessionForm
            books={books}
            selectedBook={selectedBook || null}
            bookId={bookId}
            sessionDate={sessionDate}
            startTime={startTime}
            endTime={endTime}
            startPage={startPage}
            endPage={endPage}
            minutesRead={minutesRead}
            notes={notes}
            loading={loading}
            onBookIdChange={setBookId}
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
