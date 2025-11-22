import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { Save } from 'lucide-react';
import { useBooks } from '@/hooks/useBooks';
import { CreateSessionCommand } from '@/hooks/useSessions';
import { createNote, CreateNoteCommand } from '@/hooks/useNotes';
import { Container, Stack, Section } from '@/components/ui/layout';
import { Heading } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { toast } from 'sonner';
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
    setBookId,
    setSessionDate,
    setStartTime,
    setEndTime,
    setStartPage,
    setEndPage,
    setMinutesRead,
  } = useSessionForm({ initialBookId });

  const selectedBook = books.find((b) => b.id === bookId);

  // Auto-set start page when book is selected
  useEffect(() => {
    if (selectedBook && selectedBook.current_page_text > 0) {
      setStartPage((prev) => prev || selectedBook.current_page_text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBook?.id]);

  const { seconds, isRunning, startTimer, stopTimer } = useSessionTimer(
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

  // Note state
  const [noteContent, setNoteContent] = useState('');
  const [notePage, setNotePage] = useState<number | null>(null);
  const [savingNote, setSavingNote] = useState(false);

  const handleCreateNote = async () => {
    if (!bookId) {
      toast.error('Please select a book first');
      return;
    }

    if (!noteContent.trim()) {
      toast.error('Please enter note content');
      return;
    }

    try {
      setSavingNote(true);
      const command: CreateNoteCommand = {
        book_id: bookId,
        page: notePage || null,
        content: noteContent.trim(),
      };
      await createNote(command);
      toast.success('Note created successfully');
      setNoteContent('');
      setNotePage(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create note');
    } finally {
      setSavingNote(false);
    }
  };

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
            loading={loading}
            onBookIdChange={setBookId}
            onSessionDateChange={setSessionDate}
            onStartTimeChange={setStartTime}
            onEndTimeChange={setEndTime}
            onStartPageChange={setStartPage}
            onEndPageChange={setEndPage}
            onMinutesReadChange={setMinutesRead}
            onSubmit={onSubmit}
          />

          {/* Add Note Section */}
          <Section padding="lg">
            <Stack spacing="md">
              <Heading level={3}>Add Note to the Selected Book</Heading>
              
              {selectedBook && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Page (optional)
                  </label>
                  <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                    <input
                      type="number"
                      min="0"
                      value={notePage || ''}
                      onChange={(e) => setNotePage(e.target.value ? parseInt(e.target.value) : null)}
                      className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none"
                      placeholder="Page number"
                    />
                  </HandDrawnBox>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Content *
                </label>
                <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none resize-none"
                    rows={4}
                    placeholder="Enter your note here..."
                  />
                </HandDrawnBox>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleCreateNote}
                  variant="primary"
                  icon={<Save />}
                  iconPosition="left"
                  loading={savingNote}
                  disabled={!bookId || !noteContent.trim()}
                >
                  Save Note
                </Button>
              </div>
            </Stack>
          </Section>
        </Stack>
      </div>
    </Container>
  );
}
