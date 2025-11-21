import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useBooks } from '@/hooks/useBooks';
import { createSession, CreateSessionCommand } from '@/hooks/useSessions';
import { Container, Stack, Section } from '@/components/ui/layout';
import { Heading, Paragraph } from '@/components/ui/typography';
import { ArrowLeft, Play, Pause, Square, Save } from 'lucide-react';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { HandDrawnDropdown } from '@/components/ui/inputs';

export function SessionActivePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookIdParam = searchParams.get('bookId');
  const initialBookId = bookIdParam ? parseInt(bookIdParam) : null;

  const { books } = useBooks({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [bookId, setBookId] = useState<number | null>(initialBookId);
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [startPage, setStartPage] = useState<number | null>(null);
  const [endPage, setEndPage] = useState<number | null>(null);
  const [minutesRead, setMinutesRead] = useState<number | null>(null);
  const [notes, setNotes] = useState('');

  // Timer state
  const [isRunning, setIsRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerInterval, setTimerInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  // Get selected book
  const selectedBook = books.find((b) => b.id === bookId);

  // Auto-set start page based on book's current page
  useEffect(() => {
    if (selectedBook && !startPage && selectedBook.current_page_text > 0) {
      setStartPage(selectedBook.current_page_text);
    }
  }, [selectedBook]);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    } else {
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [isRunning]);

  const startTimer = () => {
    if (!startTime) {
      const now = new Date();
      setStartTime(now.toTimeString().substring(0, 8));
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const stopTimer = () => {
    setIsRunning(false);
    const now = new Date();
    setEndTime(now.toTimeString().substring(0, 8));
    // Calculate duration from timer
    if (timerSeconds > 0) {
      const minutes = Math.floor(timerSeconds / 60);
      setMinutesRead(minutes > 0 ? minutes : null);
    }
  };

  const formatTimer = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!bookId) {
      setError('Please select a book');
      return;
    }

    if (startPage !== null && endPage !== null && endPage < startPage) {
      setError('End page cannot be less than start page');
      return;
    }

    setLoading(true);

    try {
      const command: CreateSessionCommand = {
        book_id: bookId,
        session_date: sessionDate,
        start_time: startTime || null,
        end_time: endTime || null,
        start_page: startPage || null,
        end_page: endPage || null,
        minutes_read: minutesRead || null,
        notes: notes || null,
      };

      await createSession(command);
      navigate('/sessions');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save session');
    } finally {
      setLoading(false);
    }
  };

  // Auto-calculate pages read
  useEffect(() => {
    if (startPage !== null && endPage !== null && endPage >= startPage) {
      // Pages read will be calculated automatically
    }
  }, [startPage, endPage]);

  return (
    <Container>
      <div className="py-8">
        <Stack spacing="lg">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/sessions')}
              className="p-2 rounded-md hover:bg-background-surface transition-colors"
              aria-label="Back to sessions"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Heading level={1}>New Reading Session</Heading>
          </div>

          {/* Error Message */}
          {error && (
            <Section padding="sm" className="bg-semantic-error/10 border-semantic-error">
              <Paragraph variant="secondary" className="text-semantic-error">
                {error}
              </Paragraph>
            </Section>
          )}

          {/* Timer */}
          <Section padding="lg" className="text-center">
            <div className="mb-4">
              <div className="text-4xl font-mono font-bold text-text-primary mb-2">
                {formatTimer(timerSeconds)}
              </div>
              <div className="flex items-center justify-center space-x-3">
                {!isRunning && timerSeconds === 0 && (
                  <button
                    onClick={startTimer}
                    className="flex items-center space-x-2 px-6 py-3 rounded-md bg-accent-primary text-dark-text-primary hover:bg-accent-primary/90 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    <span>Start Timer</span>
                  </button>
                )}
                {isRunning && (
                  <>
                    <button
                      onClick={pauseTimer}
                      className="flex items-center space-x-2 px-6 py-3 rounded-md bg-accent-secondary text-text-primary dark:text-dark-text-primary hover:bg-accent-secondary/90 transition-colors"
                    >
                      <Pause className="w-5 h-5" />
                      <span>Pause</span>
                    </button>
                    <button
                      onClick={stopTimer}
                      className="flex items-center space-x-2 px-6 py-3 rounded-md bg-semantic-error text-dark-text-primary hover:bg-semantic-error/90 transition-colors"
                    >
                      <Square className="w-5 h-5" />
                      <span>Stop</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </Section>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Section padding="lg">
              <Stack spacing="md">
                {/* Book Selector */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Book *
                  </label>
                  <HandDrawnDropdown
                    options={[
                      { value: '', label: 'Select a book...' },
                      ...books
                        .filter((b) => !b.is_archived)
                        .map((book) => ({
                          value: book.id || 0,
                          label: `${book.title}${book.author ? ` by ${book.author}` : ''}`,
                        })),
                    ]}
                    value={bookId || ''}
                    onChange={(value) => setBookId(value ? (typeof value === 'number' ? value : parseInt(value as string)) : null)}
                    placeholder="Select a book..."
                    searchable={books.filter((b) => !b.is_archived).length > 5}
                    borderRadius={6}
                    strokeWidth={1}
                  />
                </div>

                {selectedBook && (
                  <div className="p-3 rounded-md bg-background-surface border border-background-border">
                    <Paragraph variant="secondary" className="text-sm">
                      Current progress: {selectedBook.current_page_text} / {selectedBook.total_pages || '?'} pages
                      ({Math.round(selectedBook.progress_percentage)}%)
                    </Paragraph>
                  </div>
                )}

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Date *
                  </label>
                  <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                    <input
                      type="date"
                      required
                      value={sessionDate}
                      onChange={(e) => setSessionDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none"
                    />
                  </HandDrawnBox>
                </div>

                {/* Time Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Start Time
                    </label>
                    <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none"
                      />
                    </HandDrawnBox>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      End Time
                    </label>
                    <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none"
                      />
                    </HandDrawnBox>
                  </div>
                </div>

                {/* Pages (for books) */}
                {selectedBook && selectedBook.book_type !== 'audiobook' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        Start Page
                      </label>
                      <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                        <input
                          type="number"
                          min="0"
                          value={startPage || ''}
                          onChange={(e) =>
                            setStartPage(e.target.value ? parseInt(e.target.value) : null)
                          }
                          className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none"
                          placeholder="Page number"
                        />
                      </HandDrawnBox>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        End Page
                      </label>
                      <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                        <input
                          type="number"
                          min={startPage || 0}
                          value={endPage || ''}
                          onChange={(e) =>
                            setEndPage(e.target.value ? parseInt(e.target.value) : null)
                          }
                          className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none"
                          placeholder="Page number"
                        />
                      </HandDrawnBox>
                      {startPage !== null && endPage !== null && endPage >= startPage && (
                        <Paragraph variant="secondary" className="text-xs mt-1">
                          Pages read: {endPage - startPage}
                        </Paragraph>
                      )}
                    </div>
                  </div>
                )}

                {/* Minutes (for audiobooks) */}
                {selectedBook && selectedBook.book_type === 'audiobook' && (
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Minutes Read
                    </label>
                    <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                      <input
                        type="number"
                        min="0"
                        value={minutesRead || ''}
                        onChange={(e) =>
                          setMinutesRead(e.target.value ? parseInt(e.target.value) : null)
                        }
                        className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none"
                        placeholder="Minutes"
                      />
                    </HandDrawnBox>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Notes
                  </label>
                  <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none resize-none"
                      placeholder="Quick notes about this session..."
                    />
                  </HandDrawnBox>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/sessions')}
                    className="px-4 py-2 rounded-md border border-background-border text-text-secondary hover:bg-background-surface transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !bookId}
                    className="flex items-center space-x-2 px-4 py-2 rounded-md bg-accent-primary text-dark-text-primary hover:bg-accent-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Save Session'}</span>
                  </button>
                </div>
              </Stack>
            </Section>
          </form>
        </Stack>
      </div>
    </Container>
  );
}

