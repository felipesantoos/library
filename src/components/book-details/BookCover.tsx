import { BookDto } from '@/hooks/useBooks';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { BookOpen } from 'lucide-react';

interface BookCoverProps {
  book: BookDto;
}

export function BookCover({ book }: BookCoverProps) {
  return (
    <div className="w-full md:col-span-1">
      {book.cover_url ? (
        <HandDrawnBox borderRadius={8} strokeWidth={1} linearCorners={true} className="w-full">
          <img
            src={book.cover_url}
            alt={book.title}
            className="w-full rounded-md shadow-medium"
          />
        </HandDrawnBox>
      ) : (
        <HandDrawnBox
          borderRadius={8}
          strokeWidth={1}
          linearCorners={true}
          className="w-full aspect-[2/3] bg-background-surface flex items-center justify-center"
        >
          <BookOpen className="w-16 h-16 text-text-secondary" />
        </HandDrawnBox>
      )}
    </div>
  );
}

