import { BookDto } from '@/hooks/useBooks';
import { Section, Stack } from '@/components/ui/layout';
import { SessionEditFormFields } from './SessionEditFormFields';
import { SessionEditFormActions } from './SessionEditFormActions';

interface SessionEditFormProps {
  selectedBook: BookDto | null;
  sessionDate: string;
  startTime: string;
  endTime: string;
  startPage: number | null;
  endPage: number | null;
  minutesRead: number | null;
  loading: boolean;
  onSessionDateChange: (value: string) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onStartPageChange: (value: number | null) => void;
  onEndPageChange: (value: number | null) => void;
  onMinutesReadChange: (value: number | null) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function SessionEditForm({
  selectedBook,
  sessionDate,
  startTime,
  endTime,
  startPage,
  endPage,
  minutesRead,
  loading,
  onSessionDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onStartPageChange,
  onEndPageChange,
  onMinutesReadChange,
  onSubmit,
}: SessionEditFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <Section padding="lg">
        <Stack spacing="md">
          <SessionEditFormFields
            selectedBook={selectedBook}
            sessionDate={sessionDate}
            startTime={startTime}
            endTime={endTime}
            startPage={startPage}
            endPage={endPage}
            minutesRead={minutesRead}
            onSessionDateChange={onSessionDateChange}
            onStartTimeChange={onStartTimeChange}
            onEndTimeChange={onEndTimeChange}
            onStartPageChange={onStartPageChange}
            onEndPageChange={onEndPageChange}
            onMinutesReadChange={onMinutesReadChange}
          />

          <SessionEditFormActions loading={loading} />
        </Stack>
      </Section>
    </form>
  );
}

