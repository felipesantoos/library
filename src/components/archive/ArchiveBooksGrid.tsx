import { BookDto } from '@/hooks/useBooks';
import { ArchivedBookCard } from './ArchivedBookCard';

interface ArchiveBooksGridProps {
  books: BookDto[];
  onRestore: (book: BookDto) => void;
  onBookClick: (bookId: number) => void;
}

export function ArchiveBooksGrid({ books, onRestore, onBookClick }: ArchiveBooksGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <ArchivedBookCard
          key={book.id}
          book={book}
          onRestore={onRestore}
          onClick={() => onBookClick(book.id!)}
        />
      ))}
    </div>
  );
}

