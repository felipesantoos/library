import { useState, useEffect } from 'react';
import { BookDto, updateBook } from '@/hooks/useBooks';
import { createSession, CreateSessionCommand } from '@/hooks/useSessions';
import { Button } from '@/components/ui/Button';
import { Paragraph } from '@/components/ui/typography';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { HandDrawnModal } from '@/components/ui/HandDrawnModal';
import { Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

interface ProgressEditModalProps {
  isOpen: boolean;
  book: BookDto;
  onClose: () => void;
  onUpdate: () => void;
  onSessionCreated?: () => void;
}

export function ProgressEditModal({
  isOpen,
  book,
  onClose,
  onUpdate,
  onSessionCreated,
}: ProgressEditModalProps) {
  const [currentPage, setCurrentPage] = useState(book.current_page_text);
  const [currentMinutes, setCurrentMinutes] = useState(book.current_minutes_audio);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ page?: string; minutes?: string }>({});

  useEffect(() => {
    if (isOpen) {
      setCurrentPage(book.current_page_text);
      setCurrentMinutes(book.current_minutes_audio);
      setErrors({});
    }
  }, [isOpen, book]);

  const validatePage = (value: number): string | undefined => {
    if (value < 0) {
      return 'Page cannot be negative';
    }
    if (book.total_pages && value > book.total_pages) {
      return `Page cannot exceed ${book.total_pages}`;
    }
    return undefined;
  };

  const validateMinutes = (value: number): string | undefined => {
    if (value < 0) {
      return 'Minutes cannot be negative';
    }
    if (book.total_minutes && value > book.total_minutes) {
      return `Minutes cannot exceed ${book.total_minutes}`;
    }
    return undefined;
  };

  const handlePageChange = (value: number) => {
    const pageValue = Math.max(0, value);
    setCurrentPage(pageValue);
    const error = validatePage(pageValue);
    setErrors((prev) => ({ ...prev, page: error }));
  };

  const handleMinutesChange = (value: number) => {
    const minutesValue = Math.max(0, value);
    setCurrentMinutes(minutesValue);
    const error = validateMinutes(minutesValue);
    setErrors((prev) => ({ ...prev, minutes: error }));
  };

  const handleIncrementPage = () => {
    if (book.total_pages) {
      handlePageChange(Math.min(currentPage + 1, book.total_pages));
    } else {
      handlePageChange(currentPage + 1);
    }
  };

  const handleDecrementPage = () => {
    handlePageChange(currentPage - 1);
  };

  const handleIncrementMinutes = () => {
    if (book.total_minutes) {
      handleMinutesChange(Math.min(currentMinutes + 1, book.total_minutes));
    } else {
      handleMinutesChange(currentMinutes + 1);
    }
  };

  const handleDecrementMinutes = () => {
    handleMinutesChange(currentMinutes - 1);
  };

  const handleSave = async () => {
    // Validate before saving
    const pageError = book.total_pages ? validatePage(currentPage) : undefined;
    const minutesError = book.total_minutes ? validateMinutes(currentMinutes) : undefined;

    if (pageError || minutesError) {
      setErrors({ page: pageError, minutes: minutesError });
      return;
    }

    setIsSaving(true);
    try {
      const now = new Date();
      const sessionDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const currentTime = now.toTimeString().split(' ')[0]; // HH:MM:SS

      // Check if there are any changes that warrant creating a session
      const pageChanged = book.total_pages && book.current_page_text !== currentPage;
      const minutesChanged = book.total_minutes && book.current_minutes_audio !== currentMinutes;

      // Create a session to track this progress update if there are changes
      if (pageChanged || minutesChanged) {
        const sessionCommand: CreateSessionCommand = {
          book_id: book.id!,
          session_date: sessionDate,
          start_time: currentTime,
          end_time: currentTime,
        };

        // Add page information if pages changed
        if (pageChanged) {
          // Always use current page as start and new page as end
          // If new page is less than current, it means user is correcting progress backwards
          // In that case, we'll create a session with start = new page and end = new page
          if (currentPage < book.current_page_text) {
            // Correction backwards: create a session marking the new page as the end
            sessionCommand.start_page = currentPage;
            sessionCommand.end_page = currentPage;
          } else {
            // Normal progress: from current page to new page
            sessionCommand.start_page = book.current_page_text;
            sessionCommand.end_page = currentPage;
          }
        }

        // Add minutes information if minutes changed
        if (minutesChanged) {
          const minutesDiff = currentMinutes - book.current_minutes_audio;
          sessionCommand.minutes_read = minutesDiff > 0 ? minutesDiff : null;
        }

        try {
          await createSession(sessionCommand);
          // Session creation will automatically recalculate book progress
          // based on the most recent session's end_page
          toast.success('Progress updated successfully');
          onUpdate();
          // Refresh sessions list - await to ensure it completes
          if (onSessionCreated) {
            await onSessionCreated();
          }
          onClose();
        } catch (sessionError) {
          toast.error(`Failed to create session: ${sessionError instanceof Error ? sessionError.message : 'Unknown error'}`);
          // If session creation fails, still try to update book directly as fallback
          const updateCommand: any = {
            id: book.id!,
          };

          if (book.total_pages) {
            updateCommand.current_page_text = currentPage;
          }

          if (book.total_minutes) {
            updateCommand.current_minutes_audio = currentMinutes;
          }

          await updateBook(updateCommand);
          toast.success('Progress updated (session creation failed)');
          onUpdate();
          onClose();
        }
      } else {
        // No changes, just close
        onClose();
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update progress');
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges =
    (book.total_pages && currentPage !== book.current_page_text) ||
    (book.total_minutes && currentMinutes !== book.current_minutes_audio);

  return (
    <HandDrawnModal
      isOpen={isOpen}
      onClose={onClose}
      title="Update Progress"
    >
      <div className="space-y-4">
          {book.total_pages && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Current Page
              </label>
              <div className="flex items-center gap-2">
                <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="cursor-pointer [&:has(button:disabled)]:cursor-not-allowed">
                  <button
                    type="button"
                    onClick={handleDecrementPage}
                    disabled={currentPage <= 0}
                    className="p-2 hover:bg-background-hover disabled:opacity-50 transition-colors flex items-center justify-center w-full"
                    aria-label="Decrease page"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </HandDrawnBox>
                <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="flex-1">
                  <input
                    type="number"
                    min="0"
                    max={book.total_pages}
                    value={currentPage}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      handlePageChange(value);
                    }}
                    className="w-full px-3 py-2 text-center bg-transparent text-text-primary focus:outline-none"
                  />
                </HandDrawnBox>
                <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="cursor-pointer [&:has(button:disabled)]:cursor-not-allowed">
                  <button
                    type="button"
                    onClick={handleIncrementPage}
                    disabled={book.total_pages ? currentPage >= book.total_pages : false}
                    className="p-2 hover:bg-background-hover disabled:opacity-50 transition-colors flex items-center justify-center w-full"
                    aria-label="Increase page"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </HandDrawnBox>
              </div>
              {errors.page && (
                <Paragraph variant="secondary" className="text-semantic-error text-xs mt-1">
                  {errors.page}
                </Paragraph>
              )}
              <Paragraph variant="secondary" className="text-xs mt-1">
                of {book.total_pages} pages
              </Paragraph>
            </div>
          )}

          {book.total_minutes && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Current Minutes
              </label>
              <div className="flex items-center gap-2">
                <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="cursor-pointer [&:has(button:disabled)]:cursor-not-allowed">
                  <button
                    type="button"
                    onClick={handleDecrementMinutes}
                    disabled={currentMinutes <= 0}
                    className="p-2 hover:bg-background-hover disabled:opacity-50 transition-colors flex items-center justify-center w-full"
                    aria-label="Decrease minutes"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </HandDrawnBox>
                <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="flex-1">
                  <input
                    type="number"
                    min="0"
                    max={book.total_minutes}
                    value={currentMinutes}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      handleMinutesChange(value);
                    }}
                    className="w-full px-3 py-2 text-center bg-transparent text-text-primary focus:outline-none"
                  />
                </HandDrawnBox>
                <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="cursor-pointer [&:has(button:disabled)]:cursor-not-allowed">
                  <button
                    type="button"
                    onClick={handleIncrementMinutes}
                    disabled={book.total_minutes ? currentMinutes >= book.total_minutes : false}
                    className="p-2 hover:bg-background-hover disabled:opacity-50 transition-colors flex items-center justify-center w-full"
                    aria-label="Increase minutes"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </HandDrawnBox>
              </div>
              {errors.minutes && (
                <Paragraph variant="secondary" className="text-semantic-error text-xs mt-1">
                  {errors.minutes}
                </Paragraph>
              )}
              <Paragraph variant="secondary" className="text-xs mt-1">
                of {book.total_minutes} minutes
              </Paragraph>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isSaving || !hasChanges || !!errors.page || !!errors.minutes}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
    </HandDrawnModal>
  );
}

