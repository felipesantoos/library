import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBook } from '@/hooks/useBooks';
import { useSessions, SessionDto, updateSession, deleteSession, UpdateSessionCommand } from '@/hooks/useSessions';
import { Container, Stack, Section } from '@/components/ui/layout';
import { Heading, Paragraph, MetaText } from '@/components/ui/typography';
import { ArrowLeft, Save, Trash2, AlertTriangle, RotateCcw, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ProgressCorrectionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bookId = id ? parseInt(id) : null;

  const { book, loading: loadingBook, error: bookError } = useBook(bookId);
  const { sessions, loading: loadingSessions, error: sessionsError, refresh } = useSessions({
    book_id: bookId ?? undefined,
  });

  const [editingSessions, setEditingSessions] = useState<Map<number, Partial<SessionDto>>>(new Map());
  const [deletingSessions, setDeletingSessions] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Map<number, string>>(new Map());
  const [warnings, setWarnings] = useState<Map<number, string>>(new Map());

  // Sort sessions by date (oldest first for easier correction)
  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => a.session_date.localeCompare(b.session_date));
  }, [sessions]);

  // Validate sessions and show warnings
  useEffect(() => {
    const newWarnings = new Map<number, string>();
    const newErrors = new Map<number, string>();

    sortedSessions.forEach((session, index) => {
      if (!session.id) return;

      // Check end page >= start page
      if (session.start_page !== null && session.end_page !== null) {
        if (session.end_page < session.start_page) {
          newErrors.set(session.id, 'End page cannot be less than start page');
        }
      }

      // Check if session date is in future
      const sessionDate = new Date(session.session_date);
      if (sessionDate > new Date()) {
        newWarnings.set(session.id, 'Session date is in the future');
      }

      // Check for large gaps between sessions
      if (index > 0 && book?.total_pages) {
        const prevSession = sortedSessions[index - 1];
        if (prevSession.end_page && session.start_page !== null) {
          const gap = session.start_page - prevSession.end_page;
          if (gap > 50) {
            newWarnings.set(
              session.id,
              `Large gap: ${gap} pages since previous session`
            );
          }
        }
      }

      // Check current page <= total pages
      if (book?.total_pages && session.end_page) {
        if (session.end_page > book.total_pages) {
          newErrors.set(
            session.id,
            `End page (${session.end_page}) exceeds total pages (${book.total_pages})`
          );
        }
      }
    });

    setWarnings(newWarnings);
    setErrors(newErrors);
  }, [sortedSessions, book]);

  const handleEditSession = (sessionId: number, field: keyof SessionDto, value: any) => {
    const updated = new Map(editingSessions);
    const session = sortedSessions.find((s) => s.id === sessionId);
    
    if (!session) return;

    if (!updated.has(sessionId)) {
      updated.set(sessionId, { ...session });
    }

    const editedSession = updated.get(sessionId)!;
    (editedSession as any)[field] = value;

    // Recalculate pages_read if start/end page changed
    if (field === 'start_page' || field === 'end_page') {
      const startPage = field === 'start_page' ? value : editedSession.start_page;
      const endPage = field === 'end_page' ? value : editedSession.end_page;
      if (startPage !== null && endPage !== null && endPage >= startPage) {
        (editedSession as any).pages_read = endPage - startPage;
      }
    }

    // Clear errors for this session
    const newErrors = new Map(errors);
    newErrors.delete(sessionId);
    setErrors(newErrors);

    updated.set(sessionId, editedSession);
    setEditingSessions(updated);
  };

  const handleDeleteSession = (sessionId: number) => {
    const newDeleting = new Set(deletingSessions);
    newDeleting.add(sessionId);
    setDeletingSessions(newDeleting);
  };

  const handleCancelDelete = (sessionId: number) => {
    const newDeleting = new Set(deletingSessions);
    newDeleting.delete(sessionId);
    setDeletingSessions(newDeleting);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    const newErrors = new Map(errors);

    try {
      // Validate all edited sessions
      for (const [sessionId, editedSession] of editingSessions.entries()) {
        if (editedSession.start_page !== null && editedSession.end_page !== null) {
          if (editedSession.end_page < editedSession.start_page) {
            newErrors.set(sessionId, 'End page cannot be less than start page');
          }
        }
      }

      if (newErrors.size > 0) {
        setErrors(newErrors);
        setSaving(false);
        return;
      }

      // Save all edited sessions
      for (const [sessionId, editedSession] of editingSessions.entries()) {
        const command: UpdateSessionCommand = {
          id: sessionId,
          session_date: editedSession.session_date,
          start_time: editedSession.start_time || null,
          end_time: editedSession.end_time || null,
          start_page: editedSession.start_page,
          end_page: editedSession.end_page,
          minutes_read: editedSession.minutes_read,
          notes: editedSession.notes || null,
        };
        await updateSession(command);
      }

      // Delete marked sessions
      for (const sessionId of deletingSessions) {
        await deleteSession(sessionId);
      }

      // Clear editing state
      setEditingSessions(new Map());
      setDeletingSessions(new Set());
      await refresh();
      navigate(`/book/${bookId}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleRecalculateProgress = async () => {
    // Recalculate progress based on all sessions
    if (!bookId || !book) return;

    try {
      // Find the maximum end_page from all sessions
      let maxPage = book.current_page_text;
      let maxMinutes = book.current_minutes_audio;

      sortedSessions.forEach((session) => {
        if (session.end_page !== null && session.end_page > maxPage) {
          maxPage = session.end_page;
        }
        if (session.minutes_read !== null) {
          maxMinutes = Math.max(maxMinutes, book.current_minutes_audio + (session.minutes_read || 0));
        }
      });

      // Update book progress (this would require an update_book command)
      // For now, we'll just refresh and let the backend handle it
      await refresh();
      alert('Progress will be recalculated after saving all sessions');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to recalculate progress');
    }
  };

  if (loadingBook || loadingSessions) {
    return (
      <Container>
        <div className="py-8">
          <Paragraph>Loading...</Paragraph>
        </div>
      </Container>
    );
  }

  if (bookError || !book) {
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

  const hasChanges = editingSessions.size > 0 || deletingSessions.size > 0;
  const hasErrors = errors.size > 0;

  return (
    <Container>
      <div className="py-8 max-w-4xl">
        <Stack spacing="lg">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/book/${bookId}`)}
                className="p-2 rounded-md hover:bg-background-surface transition-colors"
                aria-label="Back to book"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <Heading level={1}>Progress Correction</Heading>
                <Paragraph variant="secondary" className="mt-1">
                  {book.title}
                </Paragraph>
              </div>
            </div>
            {hasChanges && (
              <button
                onClick={handleSaveAll}
                disabled={saving || hasErrors}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-md text-white transition-colors",
                  hasErrors
                    ? "bg-semantic-error cursor-not-allowed opacity-50"
                    : "bg-accent-primary hover:bg-accent-primary/90"
                )}
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
              </button>
            )}
          </div>

          {/* Info */}
          <Section padding="sm" className="bg-accent-primary/10 border-accent-primary/30">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-accent-primary mt-0.5" />
              <div className="flex-1">
                <Paragraph className="text-sm">
                  Edit or delete sessions to correct your reading progress. Changes will be saved when you click "Save All Changes".
                </Paragraph>
                {hasErrors && (
                  <Paragraph variant="secondary" className="text-semantic-error text-sm mt-2">
                    Please fix errors before saving.
                  </Paragraph>
                )}
              </div>
            </div>
          </Section>

          {/* Statistics */}
          <Section padding="md">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <MetaText className="text-xs">Total Sessions</MetaText>
                <Paragraph className="text-2xl font-bold mt-1">{sortedSessions.length}</Paragraph>
              </div>
              <div>
                <MetaText className="text-xs">Total Pages Read</MetaText>
                <Paragraph className="text-2xl font-bold mt-1">
                  {sortedSessions.reduce((sum, s) => sum + (s.pages_read || 0), 0)}
                </Paragraph>
              </div>
              <div>
                <MetaText className="text-xs">Current Page</MetaText>
                <Paragraph className="text-2xl font-bold mt-1">
                  {book.current_page_text} / {book.total_pages || '?'}
                </Paragraph>
              </div>
            </div>
          </Section>

          {/* Sessions List */}
          {sortedSessions.length === 0 ? (
            <Section padding="lg">
              <div className="text-center py-12">
                <Paragraph>No sessions to correct</Paragraph>
              </div>
            </Section>
          ) : (
            <Stack spacing="sm">
              {sortedSessions.map((session) => {
                if (deletingSessions.has(session.id!)) {
                  return (
                    <SessionDeleteConfirmation
                      key={session.id}
                      session={session}
                      onConfirm={async () => {
                        try {
                          await deleteSession(session.id!);
                          await refresh();
                          setDeletingSessions((prev) => {
                            const next = new Set(prev);
                            next.delete(session.id!);
                            return next;
                          });
                        } catch (err) {
                          alert(err instanceof Error ? err.message : 'Failed to delete session');
                        }
                      }}
                      onCancel={() => handleCancelDelete(session.id!)}
                    />
                  );
                }

                const edited = editingSessions.get(session.id!);
                const displaySession = edited || session;
                const hasError = errors.has(session.id!);
                const hasWarning = warnings.has(session.id!);
                const isEdited = editingSessions.has(session.id!);

                return (
                  <EditableSessionCard
                    key={session.id}
                    session={displaySession}
                    originalSession={session}
                    book={book}
                    hasError={hasError}
                    errorMessage={errors.get(session.id!)}
                    hasWarning={hasWarning}
                    warningMessage={warnings.get(session.id!)}
                    isEdited={isEdited}
                    onChange={(field, value) => handleEditSession(session.id!, field, value)}
                    onDelete={() => handleDeleteSession(session.id!)}
                  />
                );
              })}
            </Stack>
          )}

          {/* Actions */}
          {sortedSessions.length > 0 && (
            <Section padding="md" className="border-t border-background-border">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleRecalculateProgress}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md border border-background-border text-text-secondary hover:bg-background-surface transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Recalculate Progress</span>
                </button>
                <div className="flex items-center space-x-2 text-sm text-text-secondary">
                  {editingSessions.size > 0 && (
                    <span>{editingSessions.size} session(s) modified</span>
                  )}
                  {deletingSessions.size > 0 && (
                    <span className="text-semantic-error">
                      {deletingSessions.size} session(s) marked for deletion
                    </span>
                  )}
                </div>
              </div>
            </Section>
          )}
        </Stack>
      </div>
    </Container>
  );
}

function EditableSessionCard({
  session,
  originalSession,
  book,
  hasError,
  errorMessage,
  hasWarning,
  warningMessage,
  isEdited,
  onChange,
  onDelete,
}: {
  session: Partial<SessionDto>;
  originalSession: SessionDto;
  book: any;
  hasError: boolean;
  errorMessage?: string;
  hasWarning: boolean;
  warningMessage?: string;
  isEdited: boolean;
  onChange: (field: keyof SessionDto, value: any) => void;
  onDelete: () => void;
}) {
  return (
    <Section
      padding="md"
      className={cn(
        "hover:shadow-medium transition-shadow",
        hasError && "border-semantic-error border-2",
        hasWarning && !hasError && "border-semantic-warning border-2",
        isEdited && "bg-accent-primary/5"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          {/* Date */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-text-secondary mb-1">Date</label>
              <input
                type="date"
                value={session.session_date || ''}
                onChange={(e) => onChange('session_date', e.target.value)}
                className="w-full px-2 py-1 text-sm rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Start Time</label>
              <input
                type="time"
                value={session.start_time?.substring(0, 5) || ''}
                onChange={(e) => onChange('start_time', e.target.value ? `${e.target.value}:00` : null)}
                className="w-full px-2 py-1 text-sm rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">End Time</label>
              <input
                type="time"
                value={session.end_time?.substring(0, 5) || ''}
                onChange={(e) => onChange('end_time', e.target.value ? `${e.target.value}:00` : null)}
                className="w-full px-2 py-1 text-sm rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
            </div>
          </div>

          {/* Pages / Minutes */}
          {book.book_type !== 'audiobook' ? (
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-text-secondary mb-1">Start Page</label>
                <input
                  type="number"
                  min="0"
                  max={book.total_pages || undefined}
                  value={session.start_page ?? ''}
                  onChange={(e) => onChange('start_page', e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-2 py-1 text-sm rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1">End Page</label>
                <input
                  type="number"
                  min={session.start_page ?? 0}
                  max={book.total_pages || undefined}
                  value={session.end_page ?? ''}
                  onChange={(e) => onChange('end_page', e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-2 py-1 text-sm rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                />
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1">Pages Read</label>
                <input
                  type="number"
                  value={session.pages_read ?? ''}
                  readOnly
                  className="w-full px-2 py-1 text-sm rounded-md bg-background-surface/50 border border-background-border text-text-secondary cursor-not-allowed"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs text-text-secondary mb-1">Minutes Read</label>
              <input
                type="number"
                min="0"
                value={session.minutes_read ?? ''}
                onChange={(e) => onChange('minutes_read', e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-2 py-1 text-sm rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs text-text-secondary mb-1">Notes</label>
            <textarea
              value={session.notes || ''}
              onChange={(e) => onChange('notes', e.target.value || null)}
              rows={2}
              className="w-full px-2 py-1 text-sm rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none"
              placeholder="Optional notes..."
            />
          </div>

          {/* Errors & Warnings */}
          {hasError && errorMessage && (
            <div className="flex items-center space-x-2 text-sm text-semantic-error">
              <AlertTriangle className="w-4 h-4" />
              <span>{errorMessage}</span>
            </div>
          )}
          {hasWarning && !hasError && warningMessage && (
            <div className="flex items-center space-x-2 text-sm text-semantic-warning">
              <AlertTriangle className="w-4 h-4" />
              <span>{warningMessage}</span>
            </div>
          )}

          {/* Edit indicator */}
          {isEdited && (
            <div className="flex items-center space-x-2 text-xs text-accent-primary">
              <CheckCircle className="w-3 h-3" />
              <span>Modified</span>
            </div>
          )}
        </div>

        <div className="ml-4">
          <button
            onClick={onDelete}
            className="p-2 text-text-secondary hover:text-semantic-error transition-colors"
            aria-label="Delete session"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Section>
  );
}

function SessionDeleteConfirmation({
  session,
  onConfirm,
  onCancel,
}: {
  session: SessionDto;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Section padding="md" className="border-2 border-semantic-error bg-semantic-error/10">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <Paragraph className="font-medium text-semantic-error">
            Delete session from {new Date(session.session_date).toLocaleDateString()}?
          </Paragraph>
          <Paragraph variant="secondary" className="text-sm mt-1">
            This will recalculate book progress.
          </Paragraph>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-sm rounded-md border border-background-border text-text-secondary hover:bg-background-surface transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1.5 text-sm rounded-md bg-semantic-error text-white hover:bg-semantic-error/90 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </Section>
  );
}

