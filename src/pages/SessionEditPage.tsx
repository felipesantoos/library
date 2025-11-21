import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession, updateSession, UpdateSessionCommand } from '@/hooks/useSessions';
import { useBooks } from '@/hooks/useBooks';
import { Container, Stack, Section } from '@/components/ui/layout';
import { Heading, Paragraph } from '@/components/ui/typography';
import { ArrowLeft, Save } from 'lucide-react';

export function SessionEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const sessionId = id ? parseInt(id) : null;

  const { session, loading, error, refresh } = useSession(sessionId);
  const { books } = useBooks({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [sessionDate, setSessionDate] = useState('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [startPage, setStartPage] = useState<number | null>(null);
  const [endPage, setEndPage] = useState<number | null>(null);
  const [minutesRead, setMinutesRead] = useState<number | null>(null);
  const [notes, setNotes] = useState('');

  // Initialize form with session data
  useEffect(() => {
    if (session) {
      setSessionDate(session.session_date);
      setStartTime(session.start_time || '');
      setEndTime(session.end_time || '');
      setStartPage(session.start_page);
      setEndPage(session.end_page);
      setMinutesRead(session.minutes_read);
      setNotes(session.notes || '');
    }
  }, [session]);

  const selectedBook = books.find((b) => b.id === session?.book_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!sessionId) {
      setFormError('Session ID is required');
      return;
    }

    if (startPage !== null && endPage !== null && endPage < startPage) {
      setFormError('End page cannot be less than start page');
      return;
    }

    setSaving(true);

    try {
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

      await updateSession(command);
      navigate('/sessions');
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to update session');
    } finally {
      setSaving(false);
    }
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
      <div className="py-8 max-w-2xl">
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
            <Heading level={1}>Edit Session</Heading>
          </div>

          {/* Book Info */}
          {selectedBook && (
            <Section padding="sm" className="bg-background-surface">
              <Paragraph variant="secondary" className="text-sm">
                <strong>{selectedBook.title}</strong>
                {selectedBook.author && ` by ${selectedBook.author}`}
              </Paragraph>
            </Section>
          )}

          {/* Error Message */}
          {formError && (
            <Section padding="sm" className="bg-semantic-error/10 border-semantic-error">
              <Paragraph variant="secondary" className="text-semantic-error">
                {formError}
              </Paragraph>
            </Section>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Section padding="lg">
              <Stack spacing="md">
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  />
                </div>

                {/* Time Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    />
                  </div>
                </div>

                {/* Pages (for books) */}
                {selectedBook && selectedBook.book_type !== 'audiobook' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        Start Page
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={startPage || ''}
                        onChange={(e) =>
                          setStartPage(e.target.value ? parseInt(e.target.value) : null)
                        }
                        className="w-full px-3 py-2 rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        placeholder="Page number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        End Page
                      </label>
                      <input
                        type="number"
                        min={startPage || 0}
                        value={endPage || ''}
                        onChange={(e) =>
                          setEndPage(e.target.value ? parseInt(e.target.value) : null)
                        }
                        className="w-full px-3 py-2 rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        placeholder="Page number"
                      />
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
                    <input
                      type="number"
                      min="0"
                      value={minutesRead || ''}
                      onChange={(e) =>
                        setMinutesRead(e.target.value ? parseInt(e.target.value) : null)
                      }
                      className="w-full px-3 py-2 rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                      placeholder="Minutes"
                    />
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none"
                    placeholder="Quick notes about this session..."
                  />
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
                    disabled={saving}
                    className="flex items-center space-x-2 px-4 py-2 rounded-md bg-accent-primary text-white hover:bg-accent-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
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

