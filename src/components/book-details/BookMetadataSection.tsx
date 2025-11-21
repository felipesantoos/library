import { BookDto } from '@/hooks/useBooks';
import { MetaText, Paragraph } from '@/components/ui/typography';

interface BookMetadataSectionProps {
  book: BookDto;
  readingsCount: number;
}

export function BookMetadataSection({ book, readingsCount }: BookMetadataSectionProps) {
  return (
    <div className="grid grid-cols-2 gap-4 text-sm">
      {book.isbn && (
        <div>
          <MetaText>ISBN</MetaText>
          <Paragraph className="mt-0.5">{book.isbn}</Paragraph>
        </div>
      )}
      {book.publication_year && (
        <div>
          <MetaText>Year</MetaText>
          <Paragraph className="mt-0.5">{book.publication_year}</Paragraph>
        </div>
      )}
      <div>
        <MetaText>Type</MetaText>
        <Paragraph className="mt-0.5 capitalize">{book.book_type}</Paragraph>
      </div>
      <div>
        <MetaText>Status</MetaText>
        <Paragraph className="mt-0.5 capitalize">
          {book.status}
          {readingsCount > 0 && (
            <span className="text-accent-primary ml-2">
              ({readingsCount + 1}x)
            </span>
          )}
        </Paragraph>
      </div>
    </div>
  );
}

