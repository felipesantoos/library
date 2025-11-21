import React, { useState, useMemo } from 'react';
import { useAgendaBlocks, AgendaBlockDto, createAgendaBlock, updateAgendaBlock, deleteAgendaBlock, CreateAgendaBlockCommand, UpdateAgendaBlockCommand } from '@/hooks/useAgendaBlocks';
import { useSessions } from '@/hooks/useSessions';
import { useBooks } from '@/hooks/useBooks';
import { Container, Stack, Section } from '@/components/ui/layout';
import { Heading, Paragraph, MetaText } from '@/components/ui/typography';
import { Calendar, Plus, Edit2, Trash2, BookOpen, Clock, CheckCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AgendaPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingBlock, setEditingBlock] = useState<AgendaBlockDto | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Get current month start and end
  const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const monthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
  const startDateStr = monthStart.toISOString().split('T')[0];
  const endDateStr = monthEnd.toISOString().split('T')[0];

  const { blocks, loading, error, refresh } = useAgendaBlocks(
    null,
    startDateStr,
    endDateStr,
    null
  );
  
  const { sessions } = useSessions({
    start_date: startDateStr,
    end_date: endDateStr,
  });
  
  const { books } = useBooks();

  // Group blocks and sessions by date
  const eventsByDate = useMemo(() => {
    const grouped = new Map<string, { blocks: AgendaBlockDto[]; sessions: any[] }>();
    
    blocks.forEach((block) => {
      const date = block.scheduled_date;
      if (!grouped.has(date)) {
        grouped.set(date, { blocks: [], sessions: [] });
      }
      grouped.get(date)!.blocks.push(block);
    });

    sessions.forEach((session) => {
      const date = session.session_date;
      if (!grouped.has(date)) {
        grouped.set(date, { blocks: [], sessions: [] });
      }
      grouped.get(date)!.sessions.push(session);
    });

    return grouped;
  }, [blocks, sessions]);

  const handleCreate = async (command: CreateAgendaBlockCommand) => {
    try {
      await createAgendaBlock(command);
      setShowForm(false);
      refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create agenda block');
    }
  };

  const handleUpdate = async (command: UpdateAgendaBlockCommand) => {
    try {
      await updateAgendaBlock(command);
      setEditingBlock(null);
      refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update agenda block');
    }
  };

  const handleSubmit = async (command: CreateAgendaBlockCommand | UpdateAgendaBlockCommand) => {
    if ('id' in command) {
      await handleUpdate(command);
    } else {
      await handleCreate(command);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this agenda block?')) {
      try {
        await deleteAgendaBlock(id);
        refresh();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete agenda block');
      }
    }
  };

  const handleEdit = (block: AgendaBlockDto) => {
    setEditingBlock(block);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBlock(null);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday
    
    const days: Date[] = [];
    const current = new Date(startDate);
    
    // Generate 6 weeks (42 days)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  }, [selectedDate]);

  const formatTime = (time: string | null) => {
    if (!time) return '';
    // Convert HH:MM:SS to HH:MM for display
    return time.substring(0, 5);
  };

  const getDayEvents = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return eventsByDate.get(dateStr) || { blocks: [], sessions: [] };
  };

  return (
    <Container>
      <div className="py-8">
        <Stack spacing="lg">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <Heading level={1}>The Reading Almanac</Heading>
              <Paragraph variant="secondary" className="mt-2">
                Plan your reading schedule and track sessions
              </Paragraph>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center space-x-2 px-4 py-2 rounded-md bg-accent-primary text-dark-text-primary hover:bg-accent-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Block</span>
            </button>
          </div>

          {/* Entry Form */}
          {(showForm || editingBlock) && (
            <AgendaBlockForm
              block={editingBlock}
              books={books}
              defaultDate={selectedDate.toISOString().split('T')[0]}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          )}

          {/* Calendar */}
          <Section padding="md">
            <Stack spacing="md">
              {/* Month Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 rounded-md hover:bg-background-surface transition-colors"
                  aria-label="Previous month"
                >
                  <X className="w-5 h-5 rotate-90" />
                </button>
                <Heading level={2}>
                  {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Heading>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 rounded-md hover:bg-background-surface transition-colors"
                  aria-label="Next month"
                >
                  <X className="w-5 h-5 -rotate-90" />
                </button>
              </div>

              {/* Calendar Grid */}
              {loading ? (
                <Paragraph>Loading calendar...</Paragraph>
              ) : error ? (
                <Paragraph variant="secondary" className="text-semantic-error">
                  Error: {error}
                </Paragraph>
              ) : (
                <div className="border border-background-border rounded-md overflow-hidden">
                  {/* Day headers */}
                  <div className="grid grid-cols-7 bg-background-surface border-b border-background-border">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="p-2 text-center text-sm font-medium text-text-secondary border-r border-background-border last:border-r-0">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar days */}
                  <div className="grid grid-cols-7">
                    {calendarDays.map((day, index) => {
                      const isCurrentMonth = day.getMonth() === selectedDate.getMonth();
                      const isToday = day.toDateString() === new Date().toDateString();
                      const dayEvents = getDayEvents(day);
                      
                      return (
                        <div
                          key={index}
                          className={cn(
                            "min-h-[100px] p-2 border-r border-b border-background-border last:border-r-0",
                            !isCurrentMonth && "bg-background-surface/50 text-text-secondary",
                            isToday && "bg-accent-primary/10 border-accent-primary border-2"
                          )}
                        >
                          <div className={cn(
                            "text-sm font-medium mb-1",
                            isToday && "text-accent-primary"
                          )}>
                            {day.getDate()}
                          </div>
                          
                          {/* Events */}
                          <div className="space-y-1">
                            {/* Sessions */}
                            {dayEvents.sessions.map((session) => (
                              <div
                                key={session.id}
                                className="text-xs p-1 rounded bg-semantic-success/20 text-semantic-success truncate"
                                title={`Session: ${session.pages_read || 0} pages`}
                              >
                                <Clock className="w-3 h-3 inline mr-1" />
                                {session.pages_read || 0}p
                              </div>
                            ))}
                            
                            {/* Planned blocks */}
                            {dayEvents.blocks.slice(0, 2).map((block) => (
                              <div
                                key={block.id}
                                className={cn(
                                  "text-xs p-1 rounded truncate cursor-pointer",
                                  block.is_completed
                                    ? "bg-semantic-success/20 text-semantic-success"
                                    : "bg-accent-primary/20 text-accent-primary"
                                )}
                                onClick={() => handleEdit(block)}
                                title={`${block.start_time ? formatTime(block.start_time) : ''} ${block.book_id ? books.find(b => b.id === block.book_id)?.title || 'Reading' : 'Reading'}`}
                              >
                                {block.start_time && formatTime(block.start_time)}
                                {block.book_id && books.find(b => b.id === block.book_id) && (
                                  <BookOpen className="w-3 h-3 inline ml-1" />
                                )}
                              </div>
                            ))}
                            
                            {dayEvents.blocks.length > 2 && (
                              <div className="text-xs text-text-secondary">
                                +{dayEvents.blocks.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Stack>
          </Section>

          {/* Day Details (if date selected) */}
          {selectedDate && (
            <DayDetails
              date={selectedDate.toISOString().split('T')[0]}
              blocks={blocks.filter(b => b.scheduled_date === selectedDate.toISOString().split('T')[0])}
              sessions={sessions.filter(s => s.session_date === selectedDate.toISOString().split('T')[0])}
              books={books}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </Stack>
      </div>
    </Container>
  );
}

function DayDetails({
  date,
  blocks,
  sessions,
  books,
  onEdit,
  onDelete,
}: {
  date: string;
  blocks: AgendaBlockDto[];
  sessions: any[];
  books: any[];
  onEdit: (block: AgendaBlockDto) => void;
  onDelete: (id: number) => void;
}) {
  if (blocks.length === 0 && sessions.length === 0) {
    return null;
  }

  const formatTime = (time: string | null) => {
    if (!time) return '';
    return time.substring(0, 5);
  };

  const totalMinutes = sessions.reduce((sum, s) => sum + (s.minutes_read || 0), 0);
  const totalPages = sessions.reduce((sum, s) => sum + (s.pages_read || 0), 0);

  return (
    <Section padding="md">
      <Stack spacing="md">
        <Heading level={3}>
          {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </Heading>

        {/* Summary */}
        {(totalMinutes > 0 || totalPages > 0) && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-background-surface rounded-md">
            <div>
              <MetaText>Total Pages</MetaText>
              <Paragraph className="text-2xl font-bold">{totalPages}</Paragraph>
            </div>
            <div>
              <MetaText>Total Minutes</MetaText>
              <Paragraph className="text-2xl font-bold">{totalMinutes}</Paragraph>
            </div>
          </div>
        )}

        {/* Planned Blocks */}
        {blocks.length > 0 && (
          <div>
            <Heading level={4} className="text-base mb-2">Planned Blocks</Heading>
            <Stack spacing="sm">
              {blocks.map((block) => {
                const book = block.book_id ? books.find(b => b.id === block.book_id) : null;
                return (
                  <div
                    key={block.id}
                    className={cn(
                      "p-3 rounded-md border",
                      block.is_completed
                        ? "bg-semantic-success/10 border-semantic-success"
                        : "bg-accent-primary/10 border-accent-primary"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Stack spacing="sm">
                          {block.start_time && block.end_time && (
                            <MetaText className="text-xs">
                              {formatTime(block.start_time)} - {formatTime(block.end_time)}
                            </MetaText>
                          )}
                          {book && (
                            <div className="flex items-center space-x-2">
                              <BookOpen className="w-4 h-4 text-accent-primary" />
                              <Paragraph className="text-sm font-medium">{book.title}</Paragraph>
                            </div>
                          )}
                          {block.notes && (
                            <Paragraph variant="secondary" className="text-sm">{block.notes}</Paragraph>
                          )}
                          {block.is_completed && (
                            <div className="flex items-center space-x-1 text-xs text-semantic-success">
                              <CheckCircle className="w-3 h-3" />
                              <span>Completed</span>
                            </div>
                          )}
                        </Stack>
                      </div>
                      {block.id && (
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => onEdit(block)}
                            className="p-2 text-text-secondary hover:text-accent-primary transition-colors"
                            aria-label="Edit block"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(block.id!)}
                            className="p-2 text-text-secondary hover:text-semantic-error transition-colors"
                            aria-label="Delete block"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </Stack>
          </div>
        )}

        {/* Sessions */}
        {sessions.length > 0 && (
          <div>
            <Heading level={4} className="text-base mb-2">Sessions</Heading>
            <Stack spacing="sm">
              {sessions.map((session) => {
                const book = books.find(b => b.id === session.book_id);
                return (
                  <div key={session.id} className="p-3 rounded-md bg-background-surface border border-background-border">
                    <div className="flex items-center justify-between">
                      <div>
                        {book && (
                          <Paragraph className="text-sm font-medium">{book.title}</Paragraph>
                        )}
                        <MetaText className="text-xs">
                          {session.pages_read || 0} pages • {session.minutes_read || 0} minutes
                        </MetaText>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Stack>
          </div>
        )}
      </Stack>
    </Section>
  );
}

function AgendaBlockForm({
  block,
  books,
  defaultDate,
  onSubmit,
  onCancel,
}: {
  block: AgendaBlockDto | null;
  books: any[];
  defaultDate: string;
  onSubmit: (command: CreateAgendaBlockCommand | UpdateAgendaBlockCommand) => void;
  onCancel: () => void;
}) {
  const [scheduledDate, setScheduledDate] = useState(block?.scheduled_date || defaultDate);
  const [bookId, setBookId] = useState<number | null>(block?.book_id || null);
  const [startTime, setStartTime] = useState<string>(block?.start_time?.substring(0, 5) || '');
  const [endTime, setEndTime] = useState<string>(block?.end_time?.substring(0, 5) || '');
  const [notes, setNotes] = useState<string>(block?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const command: CreateAgendaBlockCommand | UpdateAgendaBlockCommand = block
      ? {
          id: block.id!,
          scheduled_date: scheduledDate,
          book_id: bookId,
          start_time: startTime ? `${startTime}:00` : null,
          end_time: endTime ? `${endTime}:00` : null,
          notes: notes || null,
        }
      : {
          scheduled_date: scheduledDate,
          book_id: bookId,
          start_time: startTime ? `${startTime}:00` : null,
          end_time: endTime ? `${endTime}:00` : null,
          notes: notes || null,
        };
    
    onSubmit(command);
  };

  return (
    <Section padding="md" className="bg-background-surface border-2 border-accent-primary">
      <form onSubmit={handleSubmit}>
        <Stack spacing="md">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Book (optional)
              </label>
              <select
                value={bookId || ''}
                onChange={(e) => setBookId(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              >
                <option value="">No book</option>
                {books.map((book) => (
                  <option key={book.id} value={book.id || 0}>
                    {book.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Start Time (optional)
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
                End Time (optional)
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none"
              placeholder="Optional notes about this reading block..."
            />
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-md border border-background-border text-text-secondary hover:bg-background-surface transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-accent-primary text-dark-text-primary hover:bg-accent-primary/90 transition-colors"
            >
              {block ? 'Update Block' : 'Create Block'}
            </button>
          </div>
        </Stack>
      </form>
    </Section>
  );
}

