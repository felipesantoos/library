import { BookDto } from '@/hooks/useBooks';
import { Section, Stack } from '@/components/ui/layout';
import { Heading, Paragraph, MetaText } from '@/components/ui/typography';
import { ProgressBar } from '@/components/ui/data-display';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { Button } from '@/components/ui/Button';
import { BookOpen, RotateCcw } from 'lucide-react';
import { formatBookStatus } from '@/lib/utils';

interface ArchivedBookCardProps {
  book: BookDto;
  onRestore: (book: BookDto) => void;
  onClick: () => void;
}

export function ArchivedBookCard({ book, onRestore, onClick }: ArchivedBookCardProps) {
  const handleRestoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRestore(book);
  };

  return (
    <Section 
      padding="md" 
      className="hover:shadow-medium hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 ease-in-out"
    >
      <Stack spacing="sm">
        {/* Cover */}
        <HandDrawnBox
          borderRadius={8}
          strokeWidth={1}
          linearCorners={true}
          className="aspect-[3/4] bg-background-surface rounded-md flex items-center justify-center overflow-hidden cursor-pointer transition-all duration-200 ease-in-out"
          onClick={onClick}
        >
          {book.cover_url ? (
            <img
              src={book.cover_url}
              alt={book.title}
              className="w-full h-full object-cover opacity-75"
            />
          ) : (
            <BookOpen className="w-12 h-12 text-text-secondary" />
          )}
        </HandDrawnBox>

        {/* Info */}
        <div onClick={onClick} className="cursor-pointer">
          <Heading level={4} className="line-clamp-2 text-base">
            {book.title}
          </Heading>
          {book.author && (
            <Paragraph variant="secondary" className="mt-1 text-sm">
              {book.author}
            </Paragraph>
          )}
        </div>

        {/* Progress */}
        {book.total_pages && book.total_pages > 0 && (
          <div className="opacity-60">
            <ProgressBar
              value={book.progress_percentage}
              label={`${book.current_page_text} / ${book.total_pages} pages`}
              size="sm"
            />
          </div>
        )}

        {/* Status */}
        <MetaText className="text-xs opacity-60">{formatBookStatus(book.status)}</MetaText>

        {/* Actions */}
        <Button
          onClick={handleRestoreClick}
          variant="outline"
          size="sm"
          fullWidth
          icon={<RotateCcw className="w-4 h-4" />}
          iconPosition="left"
          title="Restore to library"
        >
          Restore
        </Button>
      </Stack>
    </Section>
  );
}

