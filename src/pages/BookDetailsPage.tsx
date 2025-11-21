import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBook } from '@/hooks/useBooks';
import { useSessions, SessionDto } from '@/hooks/useSessions';
import { useNotes } from '@/hooks/useNotes';
import { useTags } from '@/hooks/useTags';
import { useCollections } from '@/hooks/useCollections';
import { useReadings, useCurrentReading, createReading } from '@/hooks/useReadings';
import { Container, Stack, Section } from '@/components/ui/layout';
import { Heading, Paragraph, MetaText } from '@/components/ui/typography';
import { ProgressBar, HybridProgressBar } from '@/components/ui/data-display';
import { Tag } from '@/components/ui/tags';
import { FolderKanban } from 'lucide-react';
import { ArrowLeft, BookOpen, Edit, Calendar, FileText, TrendingUp, Archive, RotateCcw, Settings, Repeat } from 'lucide-react';
import { cn } from '@/lib/utils';
import { deleteBook } from '@/hooks/useBooks';
import { invoke } from '@tauri-apps/api/core';

export function BookDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bookId = id ? parseInt(id) : null;

  const { book, loading, error, refresh } = useBook(bookId);
  const { sessions } = useSessions({ book_id: bookId ?? undefined });
  const { notes } = useNotes({ book_id: bookId ?? undefined });
  const { tags } = useTags(bookId ?? undefined);
  const { collections } = useCollections(bookId ?? undefined);
  const { readings, loading: readingsLoading, refresh: refreshReadings } = useReadings(bookId);
  const { reading: currentReading, refresh: refreshCurrentReading } = useCurrentReading(bookId);

  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'notes'>('overview');
  const [selectedReadingId, setSelectedReadingId] = useState<number | null>(null);

  // Sort sessions by date (newest first)
  const sortedSessions = React.useMemo(() => {
    return [...sessions].sort((a, b) => 
      b.session_date.localeCompare(a.session_date)
    );
  }, [sessions]);

  // Filter sessions by selected reading (if any)
  const filteredSessions = React.useMemo(() => {
    if (selectedReadingId === null) {
      return sortedSessions;
    }
    return sortedSessions.filter(s => s.reading_id === selectedReadingId);
  }, [sortedSessions, selectedReadingId]);

  // Calculate progress over time for chart
  const progressData = React.useMemo(() => {
    if (!book || sessions.length === 0) return [];

    // Group sessions by date and calculate cumulative progress
    const sessionsByDate = new Map<string, SessionDto[]>();
    sessions.forEach(session => {
      const date = session.session_date;
      if (!sessionsByDate.has(date)) {
        sessionsByDate.set(date, []);
      }
      sessionsByDate.get(date)!.push(session);
    });

    // Calculate cumulative pages read
    let cumulativePages = 0;
    const sortedDates = Array.from(sessionsByDate.keys()).sort();
    
    return sortedDates.map(date => {
      const dateSessions = sessionsByDate.get(date)!;
      const pagesRead = dateSessions.reduce((sum, s) => sum + (s.pages_read || 0), 0);
      cumulativePages += pagesRead;
      
      const startPage = book.current_page_text - cumulativePages;
      const progress = book.total_pages 
        ? ((startPage + cumulativePages) / book.total_pages * 100).toFixed(1)
        : 0;

      return {
        date,
        pages: pagesRead,
        cumulative: cumulativePages,
        progress: parseFloat(progress),
      };
    });
  }, [book, sessions]);

  if (loading) {
    return (
      <Container>
        <div className="py-8">
          <Paragraph>Loading book...</Paragraph>
        </div>
      </Container>
    );
  }

  if (error || !book) {
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

  const handleDelete = async () => {
    if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
      try {
        await deleteBook(book.id!);
        navigate('/library');
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete book');
      }
    }
  };

  return (
    <Container>
      <div className="py-8 max-w-4xl">
        <Stack spacing="lg">
          {/* Header */}
          <div className="flex items-start space-x-4">
            <button
              onClick={() => navigate('/library')}
              className="p-2 rounded-md hover:bg-background-surface transition-colors mt-1"
              aria-label="Back to library"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Heading level={1}>{book.title}</Heading>
                  {book.author && (
                    <Paragraph variant="secondary" className="mt-1">
                      by {book.author}
                    </Paragraph>
                  )}
                  {book.genre && (
                    <MetaText className="mt-1 block">{book.genre}</MetaText>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={async () => {
                      try {
                        const updatedBook = {
                          ...book,
                          is_archived: !book.is_archived,
                        };
                        await invoke('update_book', { bookDto: updatedBook });
                        refresh();
                      } catch (err) {
                        alert(err instanceof Error ? err.message : 'Failed to update book');
                      }
                    }}
                    className="p-2 rounded-md border border-background-border text-text-secondary hover:bg-background-surface transition-colors"
                    aria-label={book.is_archived ? "Restore book" : "Archive book"}
                    title={book.is_archived ? "Restore to library" : "Archive book"}
                  >
                    {book.is_archived ? (
                      <RotateCcw className="w-4 h-4" />
                    ) : (
                      <Archive className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => navigate(`/book/${book.id}/edit`)}
                    className="p-2 rounded-md border border-background-border text-text-secondary hover:bg-background-surface transition-colors"
                    aria-label="Edit book"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Book Cover & Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cover */}
            <div className="w-full md:col-span-1">
              {book.cover_url ? (
                <img
                  src={book.cover_url}
                  alt={book.title}
                  className="w-full rounded-md shadow-medium"
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-background-surface border border-background-border rounded-md flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-text-secondary" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="md:col-span-2">
              <Section padding="md">
                <Stack spacing="md">
                  {/* Progress */}
                  {(book.total_pages || book.total_minutes) && (
                    <div>
                      {(book.total_pages && book.total_minutes) ? (
                        <HybridProgressBar
                          currentPageText={book.current_page_text}
                          totalPages={book.total_pages}
                          currentMinutesAudio={book.current_minutes_audio}
                          totalMinutes={book.total_minutes}
                          showBreakdown={true}
                          size="md"
                        />
                      ) : (
                        <>
                          <div className="flex items-center justify-between mb-2">
                            <MetaText>Progress</MetaText>
                            <MetaText>{Math.round(book.progress_percentage)}%</MetaText>
                          </div>
                          <ProgressBar
                            value={book.progress_percentage}
                            size="md"
                            showPercentage
                          />
                          <div className="flex items-center justify-between text-sm text-text-secondary mt-2">
                            {book.total_pages && (
                              <span>
                                Page {book.current_page_text} of {book.total_pages}
                              </span>
                            )}
                            {book.total_minutes && (
                              <span>
                                {book.current_minutes_audio} / {book.total_minutes} minutes
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {book.isbn && (
                      <div>
                        <MetaText>ISBN</MetaText>
                        <Paragraph className="mt-0.5">{book.isbn}</Paragraph>
                      </div>
                    )}
                    {book.publication_year && (
                      <div>
                        <MetaText>Year</MetaText>
                        <Paragraph className="mt-0.5">{book.publication_year}</Paragraph>
                      </div>
                    )}
                    <div>
                      <MetaText>Type</MetaText>
                      <Paragraph className="mt-0.5 capitalize">{book.book_type}</Paragraph>
                    </div>
                    <div>
                      <MetaText>Status</MetaText>
                      <Paragraph className="mt-0.5 capitalize">
                        {book.status}
                        {readings.length > 0 && (
                          <span className="text-accent-primary ml-2">
                            ({readings.length + 1}x)
                          </span>
                        )}
                      </Paragraph>
                    </div>
                  </div>

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div>
                      <MetaText className="mb-2 block">Tags</MetaText>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <Tag
                            key={tag.id}
                            name={tag.name}
                            color={tag.color || undefined}
                            size="sm"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Collections */}
                  {collections.length > 0 && (
                    <div>
                      <MetaText className="mb-2 block">Collections</MetaText>
                      <div className="flex flex-wrap gap-2">
                        {collections.map((collection) => (
                          <div
                            key={collection.id}
                            className="flex items-center gap-1 px-2 py-1 rounded-md bg-accent-primary/20 text-accent-primary border border-accent-primary/30"
                          >
                            <FolderKanban className="w-3 h-3" />
                            <span className="text-sm">{collection.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reading Cycles */}
                  {readings.length > 0 && (
                    <div>
                      <MetaText className="mb-2 block">Reading Cycles</MetaText>
                      <div className="space-y-2">
                        <div
                          className={cn(
                            "flex items-center justify-between p-2 rounded-md border cursor-pointer transition-colors",
                            selectedReadingId === null
                              ? "bg-accent-primary/20 border-accent-primary"
                              : "bg-background-surface border-background-border hover:bg-background-surface/80"
                          )}
                          onClick={() => setSelectedReadingId(null)}
                        >
                          <div className="flex items-center space-x-2">
                            <BookOpen className="w-4 h-4 text-accent-primary" />
                            <span className="text-sm font-medium">First Reading</span>
                          </div>
                          <MetaText className="text-xs">
                            {sessions.filter(s => s.reading_id === null).length} sessions
                          </MetaText>
                        </div>
                        {readings.map((reading) => (
                          <div
                            key={reading.id}
                            className={cn(
                              "flex items-center justify-between p-2 rounded-md border cursor-pointer transition-colors",
                              selectedReadingId === reading.id
                                ? "bg-accent-primary/20 border-accent-primary"
                                : "bg-background-surface border-background-border hover:bg-background-surface/80"
                            )}
                            onClick={() => setSelectedReadingId(reading.id)}
                          >
                            <div className="flex items-center space-x-2">
                              <Repeat className="w-4 h-4 text-accent-secondary" />
                              <span className="text-sm font-medium">
                                Reading #{reading.reading_number}
                              </span>
                              {reading.status === 'completed' && (
                                <span className="text-xs text-semantic-success">✓</span>
                              )}
                            </div>
                            <MetaText className="text-xs">
                              {sessions.filter(s => s.reading_id === reading.id).length} sessions
                            </MetaText>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center space-x-3 pt-4 flex-wrap gap-2">
                    <button
                      onClick={() => navigate(`/session/new?bookId=${book.id}${selectedReadingId ? `&readingId=${selectedReadingId}` : ''}`)}
                      className="flex items-center space-x-2 px-4 py-2 rounded-md bg-accent-primary text-white hover:bg-accent-primary/90 transition-colors"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Start Session</span>
                    </button>
                    {book.status === 'completed' && (
                      <button
                        onClick={async () => {
                          if (confirm(`Start reading this book again? This will create reading cycle #${readings.length + 2}.`)) {
                            try {
                              await createReading({ book_id: book.id! });
                              await refreshReadings();
                              await refreshCurrentReading();
                              await refresh();
                            } catch (err) {
                              alert(err instanceof Error ? err.message : 'Failed to start reread');
                            }
                          }
                        }}
                        className="flex items-center space-x-2 px-4 py-2 rounded-md border border-accent-secondary text-accent-secondary hover:bg-accent-secondary/10 transition-colors"
                      >
                        <Repeat className="w-4 h-4" />
                        <span>Start Reread</span>
                      </button>
                    )}
                  </div>
                </Stack>
              </Section>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center space-x-1 border-b border-background-border">
            <button
              onClick={() => setActiveTab('overview')}
              className={cn(
                "px-4 py-2 font-medium text-sm transition-colors",
                activeTab === 'overview'
                  ? 'text-accent-primary border-b-2 border-accent-primary'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={cn(
                "px-4 py-2 font-medium text-sm transition-colors",
                activeTab === 'sessions'
                  ? 'text-accent-primary border-b-2 border-accent-primary'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>
                  Sessions ({filteredSessions.length}
                  {selectedReadingId !== null && sessions.length > filteredSessions.length && (
                    <span className="text-text-secondary"> / {sessions.length}</span>
                  )})
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={cn(
                "px-4 py-2 font-medium text-sm transition-colors",
                activeTab === 'notes'
                  ? 'text-accent-primary border-b-2 border-accent-primary'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>Notes ({notes.length})</span>
              </div>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <Stack spacing="md">
              {/* Progress Chart */}
              {progressData.length > 0 && (
                <Section padding="md">
                  <Stack spacing="sm">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-accent-primary" />
                      <Heading level={4}>Progress Over Time</Heading>
                    </div>
                    <SimpleProgressChart data={progressData} />
                  </Stack>
                </Section>
              )}

              {/* Statistics */}
              <Section padding="md">
                <Stack spacing="sm">
                  <Heading level={4}>Statistics</Heading>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <MetaText>Total Sessions</MetaText>
                      <Paragraph className="text-2xl font-bold mt-1">{sessions.length}</Paragraph>
                    </div>
                    <div>
                      <MetaText>Total Pages Read</MetaText>
                      <Paragraph className="text-2xl font-bold mt-1">
                        {sessions.reduce((sum, s) => sum + (s.pages_read || 0), 0)}
                      </Paragraph>
                    </div>
                    <div>
                      <MetaText>Total Notes</MetaText>
                      <Paragraph className="text-2xl font-bold mt-1">{notes.length}</Paragraph>
                    </div>
                    {book.added_at && (
                      <div>
                        <MetaText>Added</MetaText>
                        <Paragraph className="text-sm mt-1">
                          {new Date(book.added_at).toLocaleDateString()}
                        </Paragraph>
                      </div>
                    )}
                  </div>
                </Stack>
              </Section>
            </Stack>
          )}

          {activeTab === 'sessions' && (
            <Stack spacing="sm">
              {filteredSessions.length === 0 ? (
                <Section padding="lg">
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 mx-auto text-text-secondary mb-4" />
                    <Heading level={3}>No sessions yet</Heading>
                    <Paragraph variant="secondary" className="mt-2">
                      Start a reading session to track your progress
                    </Paragraph>
                  </div>
                </Section>
              ) : (
                <>
                  {/* Progress Correction Button */}
                  {filteredSessions.length > 0 && (
                    <Section padding="sm">
                      <button
                        onClick={() => navigate(`/book/${book.id}/progress-correction`)}
                        className="flex items-center space-x-2 px-4 py-2 rounded-md border border-background-border text-text-secondary hover:bg-background-surface transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Correct Progress</span>
                      </button>
                    </Section>
                  )}

                  {/* Sessions List */}
                  {filteredSessions.map((session) => (
                    <SessionCardInDetails
                      key={session.id}
                      session={session}
                      onEdit={(id) => navigate(`/session/${id}/edit`)}
                    />
                  ))}
                </>
              )}
            </Stack>
          )}

          {activeTab === 'notes' && (
            <Stack spacing="sm">
              {notes.length === 0 ? (
                <Section padding="lg">
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto text-text-secondary mb-4" />
                    <Heading level={3}>No notes yet</Heading>
                    <Paragraph variant="secondary" className="mt-2">
                      Add notes or highlights to this book
                    </Paragraph>
                  </div>
                </Section>
              ) : (
                notes.map((note) => (
                  <Section key={note.id} padding="md" className="hover:shadow-medium transition-shadow">
                    <Stack spacing="sm">
                      <div className="flex items-center space-x-2">
                        {note.note_type === 'highlight' && (
                          <div className="w-2 h-2 rounded-full bg-accent-secondary" />
                        )}
                        <MetaText className="text-xs">
                          {note.page && `Page ${note.page} • `}
                          {new Date(note.created_at).toLocaleDateString()}
                        </MetaText>
                      </div>
                      {note.excerpt && (
                        <div className="p-3 rounded-md bg-background-surface border-l-4 border-accent-secondary">
                          <Paragraph variant="secondary" className="text-sm italic">
                            "{note.excerpt}"
                          </Paragraph>
                        </div>
                      )}
                      <Paragraph className="text-sm">{note.content}</Paragraph>
                    </Stack>
                  </Section>
                ))
              )}
            </Stack>
          )}
        </Stack>
      </div>
    </Container>
  );
}

function SessionCardInDetails({
  session,
  onEdit,
}: {
  session: SessionDto;
  onEdit: (id: number) => void;
}) {
  return (
    <Section padding="md" className="hover:shadow-medium transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Stack spacing="sm">
            <div className="flex items-center space-x-3">
              <MetaText>{new Date(session.session_date).toLocaleDateString()}</MetaText>
              {session.start_time && (
                <MetaText>
                  {session.start_time.substring(0, 5)}
                  {session.end_time && ` - ${session.end_time.substring(0, 5)}`}
                </MetaText>
              )}
            </div>
            {session.pages_read && session.pages_read > 0 && (
              <Paragraph className="text-sm">
                Pages: {session.start_page} → {session.end_page} ({session.pages_read} pages)
              </Paragraph>
            )}
            {session.minutes_read && session.minutes_read > 0 && (
              <Paragraph className="text-sm">
                Minutes: {session.minutes_read}
              </Paragraph>
            )}
            {session.duration_formatted && (
              <MetaText>Duration: {session.duration_formatted}</MetaText>
            )}
            {session.notes && (
              <Paragraph variant="secondary" className="text-sm italic">
                "{session.notes}"
              </Paragraph>
            )}
          </Stack>
        </div>
        {session.id && (
          <button
            onClick={() => onEdit(session.id!)}
            className="p-2 text-text-secondary hover:text-accent-primary transition-colors"
            aria-label="Edit session"
          >
            <Edit className="w-4 h-4" />
          </button>
        )}
      </div>
    </Section>
  );
}

function SimpleProgressChart({ data }: { data: Array<{ date: string; progress: number }> }) {
  if (data.length === 0) return null;

  const maxProgress = Math.max(...data.map(d => d.progress), 100);
  const minProgress = Math.min(...data.map(d => d.progress), 0);

  return (
    <div className="relative w-full h-48 p-4">
      <svg viewBox="0 0 400 200" className="w-full h-full">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((percent) => (
          <g key={percent}>
            <line
              x1="0"
              y1={(200 * (100 - percent)) / 100}
              x2="400"
              y2={(200 * (100 - percent)) / 100}
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-background-border opacity-30"
            />
            <text
              x="0"
              y={(200 * (100 - percent)) / 100 + 4}
              className="text-xs fill-text-secondary"
            >
              {percent}%
            </text>
          </g>
        ))}

        {/* Progress line */}
        <polyline
          points={data
            .map((d, i) => {
              const x = (400 / (data.length - 1 || 1)) * i;
              const y = (200 * (100 - d.progress)) / 100;
              return `${x},${y}`;
            })
            .join(' ')}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-accent-primary"
        />

        {/* Data points */}
        {data.map((d, i) => {
          const x = (400 / (data.length - 1 || 1)) * i;
          const y = (200 * (100 - d.progress)) / 100;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill="currentColor"
              className="text-accent-primary"
            />
          );
        })}
      </svg>

      {/* X-axis labels */}
      <div className="flex items-center justify-between mt-2 text-xs text-text-secondary">
        {data.length > 0 && (
          <>
            <span>{new Date(data[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            {data.length > 1 && (
              <span>{new Date(data[data.length - 1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
