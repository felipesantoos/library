import { BookDto } from '@/hooks/useBooks';
import { WishlistBookCard } from './WishlistBookCard';

interface WishlistBooksGridProps {
  books: BookDto[];
  onMoveToLibrary: (book: BookDto) => void;
  onBookClick: (bookId: number) => void;
}

export function WishlistBooksGrid({
  books,
  onMoveToLibrary,
  onBookClick,
}: WishlistBooksGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <WishlistBookCard
          key={book.id}
          book={book}
          onMoveToLibrary={onMoveToLibrary}
          onClick={() => book.id && onBookClick(book.id)}
        />
      ))}
    </div>
  );
}

