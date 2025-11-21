import { BookDto } from '@/hooks/useBooks';
import { ProgressBar, HybridProgressBar } from '@/components/ui/data-display';
import { MetaText, Paragraph } from '@/components/ui/typography';

interface BookProgressSectionProps {
  book: BookDto;
}

export function BookProgressSection({ book }: BookProgressSectionProps) {
  if (!book.total_pages && !book.total_minutes) {
    return null;
  }

  if (book.total_pages && book.total_minutes) {
    return (
      <div>
        <HybridProgressBar
          currentPageText={book.current_page_text}
          totalPages={book.total_pages}
          currentMinutesAudio={book.current_minutes_audio}
          totalMinutes={book.total_minutes}
          showBreakdown={true}
          size="md"
        />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <MetaText>Progress</MetaText>
        <MetaText>{Math.round(book.progress_percentage)}%</MetaText>
      </div>
      <ProgressBar
        value={book.progress_percentage}
        size="md"
        showPercentage
      />
      <div className="flex items-center justify-between text-sm text-text-secondary mt-2">
        {book.total_pages && (
          <span>
            Page {book.current_page_text} of {book.total_pages}
          </span>
        )}
        {book.total_minutes && (
          <span>
            {book.current_minutes_audio} / {book.total_minutes} minutes
          </span>
        )}
      </div>
    </>
  );
}

