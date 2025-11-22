import { BookDto } from '@/hooks/useBooks';
import { BookCard } from './BookCard';
import { ViewMode } from './LibraryHeader';
import { cn } from '@/lib/utils';

interface BooksGridProps {
  books: BookDto[];
  viewMode: ViewMode;
  tagFilter: number | null;
  collectionFilter: number | null;
}

export function BooksGrid({ books, viewMode, tagFilter, collectionFilter }: BooksGridProps) {
  return (
    <div
      className={cn(
        viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
      )}
    >
      {books.map((book) => (
        <BookCard
          key={book.id ?? `book-${book.title}`}
          book={book}
          tagFilter={tagFilter}
          collectionFilter={collectionFilter}
        />
      ))}
    </div>
  );
}

