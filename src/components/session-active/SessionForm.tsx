import { BookDto } from '@/hooks/useBooks';
import { Section, Stack } from '@/components/ui/layout';
import { SessionFormFields } from './SessionFormFields';
import { SessionFormActions } from './SessionFormActions';

interface SessionFormProps {
  books: BookDto[];
  selectedBook: BookDto | null;
  bookId: number | null;
  sessionDate: string;
  startTime: string;
  endTime: string;
  startPage: number | null;
  endPage: number | null;
  minutesRead: number | null;
  notes: string;
  loading: boolean;
  onBookIdChange: (value: number | null) => void;
  onSessionDateChange: (value: string) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onStartPageChange: (value: number | null) => void;
  onEndPageChange: (value: number | null) => void;
  onMinutesReadChange: (value: number | null) => void;
  onNotesChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function SessionForm({
  books,
  selectedBook,
  bookId,
  sessionDate,
  startTime,
  endTime,
  startPage,
  endPage,
  minutesRead,
  notes,
  loading,
  onBookIdChange,
  onSessionDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onStartPageChange,
  onEndPageChange,
  onMinutesReadChange,
  onNotesChange,
  onSubmit,
}: SessionFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <Section padding="lg">
        <Stack spacing="md">
          <SessionFormFields
            books={books}
            selectedBook={selectedBook}
            bookId={bookId}
            sessionDate={sessionDate}
            startTime={startTime}
            endTime={endTime}
            startPage={startPage}
            endPage={endPage}
            minutesRead={minutesRead}
            notes={notes}
            onBookIdChange={onBookIdChange}
            onSessionDateChange={onSessionDateChange}
            onStartTimeChange={onStartTimeChange}
            onEndTimeChange={onEndTimeChange}
            onStartPageChange={onStartPageChange}
            onEndPageChange={onEndPageChange}
            onMinutesReadChange={onMinutesReadChange}
            onNotesChange={onNotesChange}
          />

          <SessionFormActions loading={loading} disabled={!bookId} />
        </Stack>
      </Section>
    </form>
  );
}

