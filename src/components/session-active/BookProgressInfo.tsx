import { BookDto } from '@/hooks/useBooks';
import { Paragraph } from '@/components/ui/typography';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';

interface BookProgressInfoProps {
  book: BookDto;
}

export function BookProgressInfo({ book }: BookProgressInfoProps) {
  return (
    <HandDrawnBox
      borderRadius={6}
      strokeWidth={1}
      linearCorners={true}
      className="p-3 bg-background-surface border border-background-border"
    >
      <Paragraph variant="secondary" className="text-sm">
        Current progress: {book.current_page_text} / {book.total_pages || '?'} pages
        ({Math.round(book.progress_percentage)}%)
      </Paragraph>
    </HandDrawnBox>
  );
}

