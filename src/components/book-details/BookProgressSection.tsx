import { useState } from 'react';
import { BookDto } from '@/hooks/useBooks';
import { ProgressBar, HybridProgressBar } from '@/components/ui/data-display';
import { MetaText } from '@/components/ui/typography';
import { ProgressEditModal } from './ProgressEditModal';

interface BookProgressSectionProps {
  book: BookDto;
  onRefresh?: () => void;
}

export function BookProgressSection({ book, onRefresh }: BookProgressSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!book.total_pages && !book.total_minutes) {
    return null;
  }

  const handleProgressClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleUpdate = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  if (book.total_pages && book.total_minutes) {
    return (
      <>
        <div
          onClick={handleProgressClick}
          className="cursor-pointer hover:opacity-80 transition-opacity relative group"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleProgressClick();
            }
          }}
          aria-label="Click to edit progress"
        >
          <HybridProgressBar
            currentPageText={book.current_page_text}
            totalPages={book.total_pages}
            currentMinutesAudio={book.current_minutes_audio}
            totalMinutes={book.total_minutes}
            showBreakdown={true}
            size="md"
          />
        </div>
        <ProgressEditModal
          isOpen={isModalOpen}
          book={book}
          onClose={handleModalClose}
          onUpdate={handleUpdate}
        />
      </>
    );
  }

  return (
    <>
      <div
        onClick={handleProgressClick}
        className="cursor-pointer hover:opacity-80 transition-opacity relative group"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleProgressClick();
          }
        }}
        aria-label="Click to edit progress"
      >
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
      </div>
      <ProgressEditModal
        isOpen={isModalOpen}
        book={book}
        onClose={handleModalClose}
        onUpdate={handleUpdate}
      />
    </>
  );
}

