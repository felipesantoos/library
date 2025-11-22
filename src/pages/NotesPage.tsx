import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '@/hooks/useNotes';
import { useBooks } from '@/hooks/useBooks';
import { Container, Stack, Section } from '@/components/ui/layout';
import { Paragraph } from '@/components/ui/typography';
import {
  NotesHeader,
  NotesSearch,
  NotesFilters,
  NotesList,
  EmptyNotesState,
  NoteForm,
  useNoteActions,
} from '@/components/notes';

export function NotesPage() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookFilter, setBookFilter] = useState<number | null>(null);

  const { books } = useBooks({});
  const { notes, loading, error, refresh } = useNotes({
    book_id: bookFilter ?? undefined,
    search_query: searchQuery || undefined,
  });

  const { handleCreate, handleDelete } = useNoteActions(() => {
    setShowForm(false);
    refresh();
  });

  const handleFormSubmit = (command: any) => {
    handleCreate(command);
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
          <NotesHeader
            notesCount={notes.length}
            onNewNoteClick={() => setShowForm(!showForm)}
          />

          <NotesSearch
            value={searchQuery}
            onChange={setSearchQuery}
          />

          <NotesFilters
            bookFilter={bookFilter}
            books={books}
            onBookFilterChange={setBookFilter}
          />

          {showForm && (
            <NoteForm
              books={books}
              onSubmit={handleFormSubmit}
              onCancel={() => setShowForm(false)}
            />
          )}

          {notes.length === 0 ? (
            <EmptyNotesState />
          ) : (
            <NotesList
              notes={notes}
              books={books}
              onDelete={handleDelete}
              onBookClick={(bookId) => navigate(`/book/${bookId}`)}
            />
          )}
        </Stack>
      </div>
    </Container>
  );
}
