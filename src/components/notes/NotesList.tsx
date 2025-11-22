import { NoteDto } from '@/hooks/useNotes';
import { BookDto } from '@/hooks/useBooks';
import { Stack } from '@/components/ui/layout';
import { NoteCard } from './NoteCard';

interface NotesListProps {
  notes: NoteDto[];
  books: BookDto[];
  onDelete: (id: number) => void;
  onBookClick: (bookId: number) => void;
}

export function NotesList({ notes, books, onDelete, onBookClick }: NotesListProps) {
  return (
    <Stack spacing="sm">
      {notes.map((note) => {
        const book = books.find((b) => b.id === note.book_id) || null;
        return (
          <NoteCard
            key={note.id}
            note={note}
            book={book}
            onDelete={onDelete}
            onBookClick={onBookClick}
          />
        );
      })}
    </Stack>
  );
}

