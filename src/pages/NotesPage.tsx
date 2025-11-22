import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotes, NoteDto, UpdateNoteCommand } from '@/hooks/useNotes';
import { useBooks } from '@/hooks/useBooks';
import { Container, Stack, Section } from '@/components/ui/layout';
import { Paragraph } from '@/components/ui/typography';
import { HandDrawnModal } from '@/components/ui/HandDrawnModal';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { Button } from '@/components/ui/Button';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
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
  const [editingNote, setEditingNote] = useState<NoteDto | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editPage, setEditPage] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const { books } = useBooks({});
  const { notes, loading, error, refresh } = useNotes({
    book_id: bookFilter ?? undefined,
    search_query: searchQuery || undefined,
  });

  const { handleCreate, handleUpdate, handleDelete } = useNoteActions(() => {
    setShowForm(false);
    refresh();
  });

  const handleFormSubmit = (command: any) => {
    handleCreate(command);
  };

  const handleEdit = (note: NoteDto) => {
    setEditingNote(note);
    setEditContent(note.content);
    setEditPage(note.page);
  };

  const handleSaveEdit = async () => {
    if (!editingNote || !editingNote.id) return;
    
    if (!editContent.trim()) {
      toast.error('Please enter note content');
      return;
    }

    try {
      setSaving(true);
      const command: UpdateNoteCommand = {
        id: editingNote.id,
        content: editContent.trim(),
        page: editPage === null || editPage === undefined ? null : editPage,
      };
      
      await handleUpdate(command);
      setEditingNote(null);
      setEditContent('');
      setEditPage(null);
    } catch (err) {
      // Error is already handled by useNoteActions
    } finally {
      setSaving(false);
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
              onEdit={handleEdit}
              onDelete={handleDelete}
              onBookClick={(bookId) => navigate(`/book/${bookId}`)}
            />
          )}
        </Stack>

        {editingNote && (
          <HandDrawnModal
            isOpen={!!editingNote}
            onClose={() => {
              setEditingNote(null);
              setEditContent('');
              setEditPage(null);
            }}
            title="Edit Note"
            maxWidth="md"
          >
            <Stack spacing="md">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Page (optional)
                </label>
                <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                  <input
                    type="number"
                    min="0"
                    value={editPage ?? ''}
                    onChange={(e) => {
                      const value = e.target.value.trim();
                      if (value === '') {
                        setEditPage(null);
                      } else {
                        const parsed = parseInt(value, 10);
                        setEditPage(isNaN(parsed) ? null : parsed);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none"
                    placeholder="Page number"
                  />
                </HandDrawnBox>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Content *
                </label>
                <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none resize-none"
                    rows={4}
                    placeholder="Enter your note here..."
                  />
                </HandDrawnBox>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <Button
                  type="button"
                  onClick={() => {
                    setEditingNote(null);
                    setEditContent('');
                    setEditPage(null);
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveEdit}
                  variant="primary"
                  icon={<Save />}
                  iconPosition="left"
                  loading={saving}
                  disabled={!editContent.trim()}
                >
                  Save Note
                </Button>
              </div>
            </Stack>
          </HandDrawnModal>
        )}
      </div>
    </Container>
  );
}
