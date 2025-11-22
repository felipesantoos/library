import { useState } from 'react';
import { BookDto } from '@/hooks/useBooks';
import { ProgressBar, HybridProgressBar } from '@/components/ui/data-display';
import { MetaText } from '@/components/ui/typography';
import { ProgressEditModal } from './ProgressEditModal';
import { Pencil } from 'lucide-react';

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
            actionSlot={
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-background-surface dark:bg-dark-background-surface rounded-full p-1 shadow-sm border border-border-primary">
                  <Pencil className="w-3 h-3 text-text-secondary" />
                </div>
              </div>
            }
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
        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <div className="bg-background-surface dark:bg-dark-background-surface rounded-full p-1.5 shadow-sm border border-border-primary">
            <Pencil className="w-3.5 h-3.5 text-text-secondary" />
          </div>
        </div>
        <div className="flex items-center justify-between mb-2">
          <MetaText>Progress</MetaText>
          <div className="flex items-center gap-2">
            <MetaText>{Math.round(book.progress_percentage)}%</MetaText>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-background-surface dark:bg-dark-background-surface rounded-full p-1 shadow-sm border border-border-primary">
                <Pencil className="w-3 h-3 text-text-secondary" />
              </div>
            </div>
          </div>
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

