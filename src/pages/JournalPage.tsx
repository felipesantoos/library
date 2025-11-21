import React, { useState, useMemo } from 'react';
import { useJournalEntries, JournalEntryDto, createJournalEntry, updateJournalEntry, deleteJournalEntry, CreateJournalEntryCommand, UpdateJournalEntryCommand } from '@/hooks/useJournalEntries';
import { useBooks } from '@/hooks/useBooks';
import { Container, Stack, Section } from '@/components/ui/layout';
import { Heading, Paragraph, MetaText } from '@/components/ui/typography';
import { BookOpen, Plus, Edit2, Trash2, Calendar, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function JournalPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntryDto | null>(null);
  const [bookFilter, setBookFilter] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const { entries, loading, error, refresh } = useJournalEntries(
    bookFilter,
    startDate,
    endDate
  );
  const { books } = useBooks();

  // Group entries by date
  const entriesByDate = useMemo(() => {
    const grouped = new Map<string, JournalEntryDto[]>();
    entries.forEach((entry) => {
      const date = entry.entry_date;
      if (!grouped.has(date)) {
        grouped.set(date, []);
      }
      grouped.get(date)!.push(entry);
    });
    return grouped;
  }, [entries]);

  const handleCreate = async (command: CreateJournalEntryCommand) => {
    try {
      await createJournalEntry(command);
      setShowForm(false);
      refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create journal entry');
    }
  };

  const handleUpdate = async (command: UpdateJournalEntryCommand) => {
    try {
      await updateJournalEntry(command);
      setEditingEntry(null);
      refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update journal entry');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this journal entry?')) {
      try {
        await deleteJournalEntry(id);
        refresh();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete journal entry');
      }
    }
  };

  const handleEdit = (entry: JournalEntryDto) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEntry(null);
  };

  const clearFilters = () => {
    setBookFilter(null);
    setStartDate(null);
    setEndDate(null);
  };

  const hasFilters = bookFilter !== null || startDate !== null || endDate !== null;

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format date short
  const formatDateShort = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Container>
      <div className="py-8">
        <Stack spacing="lg">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <Heading level={1}>Reading Journal</Heading>
              <Paragraph variant="secondary" className="mt-2">
                Reflect on your reading journey
              </Paragraph>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center space-x-2 px-4 py-2 rounded-md bg-accent-primary text-white hover:bg-accent-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Entry</span>
            </button>
          </div>

          {/* Filters */}
          <Section padding="sm">
            <Stack direction="row" spacing="md" className="flex-wrap items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Book
                </label>
                <select
                  value={bookFilter || ''}
                  onChange={(e) => setBookFilter(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                >
                  <option value="">All Books</option>
                  {books.map((book) => (
                    <option key={book.id} value={book.id || 0}>
                      {book.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate || ''}
                  onChange={(e) => setStartDate(e.target.value || null)}
                  className="w-full px-3 py-2 rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                />
              </div>

              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate || ''}
                  onChange={(e) => setEndDate(e.target.value || null)}
                  className="w-full px-3 py-2 rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                />
              </div>

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md border border-background-border text-text-secondary hover:bg-background-surface transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Clear Filters</span>
                </button>
              )}
            </Stack>
          </Section>

          {/* Entry Form */}
          {(showForm || editingEntry) && (
            <JournalEntryForm
              entry={editingEntry}
              books={books}
              onSubmit={editingEntry ? handleUpdate : handleCreate}
              onCancel={handleCancel}
            />
          )}

          {/* Entries Timeline */}
          {loading ? (
            <Section padding="lg">
              <Paragraph>Loading journal entries...</Paragraph>
            </Section>
          ) : error ? (
            <Section padding="lg">
              <Paragraph variant="secondary" className="text-semantic-error">
                Error: {error}
              </Paragraph>
            </Section>
          ) : entries.length === 0 ? (
            <Section padding="lg">
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto text-text-secondary mb-4" />
                <Heading level={3}>No journal entries yet</Heading>
                <Paragraph variant="secondary" className="mt-2">
                  Start writing to reflect on your reading journey
                </Paragraph>
              </div>
            </Section>
          ) : (
            <Stack spacing="lg">
              {Array.from(entriesByDate.entries())
                .sort((a, b) => b[0].localeCompare(a[0])) // Sort dates descending
                .map(([date, dateEntries]) => (
                  <div key={date}>
                    <div className="flex items-center space-x-3 mb-4">
                      <Calendar className="w-5 h-5 text-accent-primary" />
                      <Heading level={3} className="text-base">
                        {formatDate(date)}
                      </Heading>
                    </div>
                    <Stack spacing="sm">
                      {dateEntries.map((entry) => (
                        <JournalEntryCard
                          key={entry.id}
                          entry={entry}
                          books={books}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                    </Stack>
                  </div>
                ))}
            </Stack>
          )}
        </Stack>
      </div>
    </Container>
  );
}

function JournalEntryCard({
  entry,
  books,
  onEdit,
  onDelete,
}: {
  entry: JournalEntryDto;
  books: any[];
  onEdit: (entry: JournalEntryDto) => void;
  onDelete: (id: number) => void;
}) {
  const book = entry.book_id
    ? books.find((b) => b.id === entry.book_id)
    : null;

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  // Preview content (first 200 characters)
  const contentPreview = entry.content.length > 200
    ? entry.content.substring(0, 200) + '...'
    : entry.content;

  return (
    <Section padding="md" className="hover:shadow-medium transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Stack spacing="sm">
            {book && (
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-accent-primary" />
                <Paragraph className="text-sm font-medium text-accent-primary">
                  {book.title}
                </Paragraph>
              </div>
            )}
            <Paragraph className="whitespace-pre-wrap">{contentPreview}</Paragraph>
            <MetaText className="text-xs">
              {formatTime(entry.created_at)}
              {entry.updated_at !== entry.created_at && ' (edited)'}
            </MetaText>
          </Stack>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(entry)}
            className="p-2 text-text-secondary hover:text-accent-primary transition-colors"
            aria-label="Edit entry"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => entry.id && onDelete(entry.id)}
            className="p-2 text-text-secondary hover:text-semantic-error transition-colors"
            aria-label="Delete entry"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Section>
  );
}

function JournalEntryForm({
  entry,
  books,
  onSubmit,
  onCancel,
}: {
  entry: JournalEntryDto | null;
  books: any[];
  onSubmit: (command: CreateJournalEntryCommand | UpdateJournalEntryCommand) => void;
  onCancel: () => void;
}) {
  const today = new Date().toISOString().split('T')[0];
  
  const [entryDate, setEntryDate] = useState(entry?.entry_date || today);
  const [content, setContent] = useState(entry?.content || '');
  const [bookId, setBookId] = useState<number | null>(entry?.book_id || null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (entry) {
      onSubmit({
        id: entry.id!,
        entry_date: entryDate,
        content,
        book_id: bookId,
      });
    } else {
      onSubmit({
        entry_date: entryDate,
        content,
        book_id: bookId,
      });
    }
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
                value={entryDate}
                onChange={(e) => setEntryDate(e.target.value)}
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

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Content *
            </label>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none font-serif"
              placeholder="Write your thoughts, reflections, or insights here..."
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
              className="px-4 py-2 rounded-md bg-accent-primary text-white hover:bg-accent-primary/90 transition-colors"
            >
              {entry ? 'Update Entry' : 'Create Entry'}
            </button>
          </div>
        </Stack>
      </form>
    </Section>
  );
}

