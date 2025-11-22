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

  // Calculate progress percentage based on current values
  const calculateProgress = () => {
    const currentPage = typeof book.current_page_text === 'number' ? book.current_page_text : 0;
    const currentMinutes = typeof book.current_minutes_audio === 'number' ? book.current_minutes_audio : 0;
    const totalPages = typeof book.total_pages === 'number' ? book.total_pages : null;
    const totalMinutes = typeof book.total_minutes === 'number' ? book.total_minutes : null;

    // For hybrid books, calculate combined progress
    if (totalPages && totalPages > 0 && totalMinutes && totalMinutes > 0) {
      const textProgress = (currentPage / totalPages) * 100;
      const audioProgress = (currentMinutes / totalMinutes) * 100;
      return (textProgress * 0.5) + (audioProgress * 0.5);
    }

    // For text-only books
    if (totalPages && totalPages > 0) {
      return (currentPage / totalPages) * 100;
    }

    // For audio-only books
    if (totalMinutes && totalMinutes > 0) {
      return (currentMinutes / totalMinutes) * 100;
    }

    return 0;
  };

  const progressPercentage = calculateProgress();

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
          <MetaText>{Math.round(progressPercentage)}%</MetaText>
        </div>
        <ProgressBar
          value={progressPercentage}
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

