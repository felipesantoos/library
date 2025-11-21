import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes, NoteDto, createNote, deleteNote, CreateNoteCommand } from '@/hooks/useNotes';
import { useBooks } from '@/hooks/useBooks';
import { Container, Stack, Section } from '@/components/ui/layout';
import { Heading, Paragraph, MetaText } from '@/components/ui/typography';
import { SentimentBadge } from '@/components/ui/notes/SentimentBadge';
import { BookOpen, Plus, Search, Trash2, FileText, Highlighter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';

export function NotesPage() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'note' | 'highlight'>('all');
  const [bookFilter, setBookFilter] = useState<number | null>(null);
  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'inspiration' | 'doubt' | 'reflection' | 'learning'>('all');

  const { books } = useBooks({});
  const { notes, loading, error, refresh } = useNotes({
    book_id: bookFilter ?? undefined,
    note_type: typeFilter !== 'all' ? typeFilter : undefined,
    sentiment: sentimentFilter !== 'all' ? sentimentFilter : undefined,
    search_query: searchQuery || undefined,
  });

  const handleCreate = async (command: CreateNoteCommand) => {
    try {
      await createNote(command);
      setShowForm(false);
      refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create note');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(id);
        refresh();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete note');
      }
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="py-8">
          <Paragraph>Loading notes...</Paragraph>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="py-8">
          <Paragraph variant="secondary" className="text-semantic-error">
            Error: {error}
          </Paragraph>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <Stack spacing="lg">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <Heading level={1}>Marginalia & Annotations</Heading>
              <Paragraph variant="secondary" className="mt-2">
                {notes.length} {notes.length === 1 ? 'note' : 'notes'} recorded
              </Paragraph>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center space-x-2 px-4 py-2 rounded-md bg-accent-primary text-dark-text-primary hover:bg-accent-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Note</span>
            </button>
          </div>

          {/* Search */}
          <Section padding="sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <HandDrawnBox borderRadius={6} strokeWidth={1} className="w-full">
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                />
              </HandDrawnBox>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-text-secondary hover:text-text-primary transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </Section>

          {/* Filters */}
          <Section padding="sm">
            <Stack direction="row" spacing="md" className="flex-wrap">

              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Type
                </label>
                <HandDrawnBox borderRadius={6} strokeWidth={1} className="w-full">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  >
                  <option value="all">All Types</option>
                  <option value="note">Notes</option>
                  <option value="highlight">Highlights</option>
                  </select>
                </HandDrawnBox>
              </div>

              <div className="flex-1 min-w-[180px]">
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Sentiment
                </label>
                <HandDrawnBox borderRadius={6} strokeWidth={1} className="w-full">
                  <select
                    value={sentimentFilter}
                    onChange={(e) => setSentimentFilter(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  >
                  <option value="all">All Sentiments</option>
                  <option value="inspiration">Inspiration</option>
                  <option value="doubt">Doubt</option>
                  <option value="reflection">Reflection</option>
                  <option value="learning">Learning</option>
                  </select>
                </HandDrawnBox>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Book
                </label>
                <HandDrawnBox borderRadius={6} strokeWidth={1} className="w-full">
                  <select
                  value={bookFilter || ''}
                  onChange={(e) => setBookFilter(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                >
                  <option value="">All Books</option>
                  {books.map((book) => (
                    <option key={book.id} value={book.id || 0}>
                      {book.title}
                    </option>
                  ))}
                </select>
                </HandDrawnBox>
              </div>
            </Stack>
          </Section>

          {/* Note Form */}
          {showForm && (
            <NoteForm
              books={books}
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
            />
          )}

          {/* Notes List */}
          {notes.length === 0 ? (
            <Section padding="lg">
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto text-text-secondary mb-4" />
                <Heading level={3}>No notes yet</Heading>
                <Paragraph variant="secondary" className="mt-2">
                  Create your first note or highlight to get started
                </Paragraph>
              </div>
            </Section>
          ) : (
            <Stack spacing="sm">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  books={books}
                  onDelete={handleDelete}
                  onBookClick={(bookId) => navigate(`/book/${bookId}`)}
                />
              ))}
            </Stack>
          )}
        </Stack>
      </div>
    </Container>
  );
}

function NoteCard({
  note,
  books,
  onDelete,
  onBookClick,
}: {
  note: NoteDto;
  books: any[];
  onDelete: (id: number) => void;
  onBookClick: (bookId: number) => void;
}) {
  const book = books.find((b) => b.id === note.book_id);

  return (
    <Section padding="md" className="hover:shadow-medium hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 ease-in-out">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Stack spacing="sm">
            <div className="flex items-center space-x-3">
              {note.note_type === 'highlight' ? (
                <Highlighter className="w-5 h-5 text-accent-secondary" />
              ) : (
                <FileText className="w-5 h-5 text-text-secondary" />
              )}
              <div>
                <div className="flex items-center space-x-2">
                  {book && (
                    <button
                      onClick={() => onBookClick(note.book_id)}
                      className="font-semibold text-accent-primary hover:underline hover:text-accent-primary/80 transition-colors duration-200"
                    >
                      {book.title}
                    </button>
                  )}
                  {note.page && (
                    <MetaText className="text-xs">Page {note.page}</MetaText>
                  )}
                </div>
                {note.sentiment && (
                  <SentimentBadge sentiment={note.sentiment as any} size="sm" />
                )}
              </div>
            </div>

            {note.excerpt && (
              <div className="pl-8 p-3 rounded-md bg-background-surface border-l-4 border-accent-secondary">
                <Paragraph variant="secondary" className="italic text-sm">
                  "{note.excerpt}"
                </Paragraph>
              </div>
            )}

            <div className="pl-8">
              <Paragraph className="text-sm whitespace-pre-wrap">{note.content}</Paragraph>
            </div>

            <MetaText className="pl-8 text-xs">
              {new Date(note.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </MetaText>
          </Stack>
        </div>

        {note.id && (
          <button
            onClick={() => onDelete(note.id!)}
            className="p-2 text-text-secondary hover:text-semantic-error transition-colors"
            aria-label="Delete note"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </Section>
  );
}

function NoteForm({
  books,
  onSubmit,
  onCancel,
}: {
  books: any[];
  onSubmit: (command: CreateNoteCommand) => void;
  onCancel: () => void;
}) {
  const [bookId, setBookId] = useState<number | null>(null);
  const [noteType, setNoteType] = useState<'note' | 'highlight'>('note');
  const [page, setPage] = useState<number | null>(null);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [sentiment, setSentiment] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookId || !content.trim()) {
      alert('Please select a book and enter note content');
      return;
    }

    if (noteType === 'highlight' && !excerpt.trim()) {
      alert('Highlight excerpt is required');
      return;
    }

    onSubmit({
      book_id: bookId,
      note_type: noteType,
      page: page || null,
      excerpt: noteType === 'highlight' ? excerpt : null,
      content: content.trim(),
      sentiment: sentiment ? (sentiment as any) : null,
    });

    // Reset form
    setBookId(null);
    setNoteType('note');
    setPage(null);
    setExcerpt('');
    setContent('');
    setSentiment('');
  };

  return (
    <Section padding="md" className="bg-background-surface border-2 border-accent-primary">
      <form onSubmit={handleSubmit}>
        <Stack spacing="md">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Book *
              </label>
              <HandDrawnBox borderRadius={6} strokeWidth={1} className="w-full">
                <select
                  required
                  value={bookId || ''}
                  onChange={(e) => setBookId(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                >
                <option value="">Select a book...</option>
                {books
                  .filter((b) => !b.is_archived)
                  .map((book) => (
                    <option key={book.id} value={book.id || 0}>
                      {book.title} {book.author ? `by ${book.author}` : ''}
                    </option>
                  ))}
                </select>
              </HandDrawnBox>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Type *
              </label>
              <HandDrawnBox borderRadius={6} strokeWidth={1} className="w-full">
                <select
                  required
                  value={noteType}
                  onChange={(e) => setNoteType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                >
                  <option value="note">Note</option>
                  <option value="highlight">Highlight</option>
                </select>
              </HandDrawnBox>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Page
              </label>
              <HandDrawnBox borderRadius={6} strokeWidth={1} className="w-full">
                <input
                  type="number"
                  min="0"
                  value={page || ''}
                  onChange={(e) => setPage(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  placeholder="Optional"
                />
              </HandDrawnBox>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Sentiment (optional)
              </label>
              <div className="flex items-center gap-2">
                <HandDrawnBox borderRadius={6} strokeWidth={1} className="flex-1">
                  <select
                    value={sentiment}
                    onChange={(e) => setSentiment(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  >
                  <option value="">None</option>
                  <option value="inspiration">Inspiration</option>
                  <option value="doubt">Doubt</option>
                    <option value="reflection">Reflection</option>
                    <option value="learning">Learning</option>
                  </select>
                </HandDrawnBox>
                {sentiment && (
                  <SentimentBadge sentiment={sentiment as any} size="md" variant="outline" />
                )}
              </div>
            </div>
          </div>

          {noteType === 'highlight' && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Excerpt *
              </label>
              <HandDrawnBox borderRadius={6} strokeWidth={1} className="w-full">
                <textarea
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none"
                  placeholder="Selected text..."
                />
              </HandDrawnBox>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Content *
            </label>
            <HandDrawnBox borderRadius={6} strokeWidth={1} className="w-full">
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none"
                placeholder="Your note or comment..."
              />
            </HandDrawnBox>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <HandDrawnBox borderRadius={6} strokeWidth={1}>
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-md text-text-secondary hover:bg-background-surface transition-colors"
              >
                Cancel
              </button>
            </HandDrawnBox>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-accent-primary text-dark-text-primary hover:bg-accent-primary/90 transition-colors"
            >
              Save Note
            </button>
          </div>
        </Stack>
      </form>
    </Section>
  );
}

