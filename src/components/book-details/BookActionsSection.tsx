import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookDto } from '@/hooks/useBooks';
import { Button } from '@/components/ui/Button';
import { Calendar, Repeat, Plus } from 'lucide-react';
import { createReading } from '@/hooks/useReadings';
import { createNote, CreateNoteCommand } from '@/hooks/useNotes';
import { HandDrawnModal } from '@/components/ui/HandDrawnModal';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { Stack } from '@/components/ui/layout';
import { Save } from 'lucide-react';
import { toast } from '@/utils/toast';

interface BookActionsSectionProps {
  book: BookDto;
  selectedReadingId: number | null;
  readingsCount: number;
  onRefresh: () => void;
  onRefreshReadings: () => void;
  onRefreshCurrentReading: () => void;
  onNoteCreated?: () => void;
}

export function BookActionsSection({
  book,
  selectedReadingId,
  readingsCount,
  onRefresh,
  onRefreshReadings,
  onRefreshCurrentReading,
  onNoteCreated,
}: BookActionsSectionProps) {
  const navigate = useNavigate();
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [notePage, setNotePage] = useState<number | null>(null);
  const [savingNote, setSavingNote] = useState(false);

  const handleStartReread = async () => {
    if (confirm(`Start reading this book again? This will create reading cycle #${readingsCount + 2}.`)) {
      try {
        await createReading({ book_id: book.id! });
        await onRefreshReadings();
        await onRefreshCurrentReading();
        await onRefresh();
        toast.success('New reading cycle started');
      } catch (err) {
        toast.handleError(err, 'Failed to start reread');
      }
    }
  };

  const handleCreateNote = async () => {
    if (!noteContent.trim()) {
      toast.error('Please enter note content');
      return;
    }

    try {
      setSavingNote(true);
      const command: CreateNoteCommand = {
        book_id: book.id!,
        page: notePage || null,
        content: noteContent.trim(),
      };
      await createNote(command);
      toast.success('Note created successfully');
      setIsNoteModalOpen(false);
      setNoteContent('');
      setNotePage(null);
      onNoteCreated?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create note');
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <>
      <div className="flex items-center space-x-3 pt-4 flex-wrap gap-2">
        <Button
          onClick={() => navigate(`/session/new?bookId=${book.id}${selectedReadingId ? `&readingId=${selectedReadingId}` : ''}`)}
          variant="primary"
          icon={<Calendar className="w-4 h-4" />}
          iconPosition="left"
        >
          Start Session
        </Button>
        <Button
          onClick={() => setIsNoteModalOpen(true)}
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          iconPosition="left"
        >
          Add Note
        </Button>
        {book.status === 'completed' && (
          <Button
            onClick={handleStartReread}
            variant="outline"
            icon={<Repeat className="w-4 h-4" />}
            iconPosition="left"
          >
            Start Reread
          </Button>
        )}
      </div>

      <HandDrawnModal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false);
          setNoteContent('');
          setNotePage(null);
        }}
        title="Add Note"
        maxWidth="md"
      >
        <Stack spacing="md">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Page (optional)
            </label>
            <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
              <input
                type="number"
                min="0"
                value={notePage || ''}
                onChange={(e) => setNotePage(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none"
                placeholder="Page number"
              />
            </HandDrawnBox>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Content *
            </label>
            <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none resize-none"
                rows={4}
                placeholder="Enter your note here..."
              />
            </HandDrawnBox>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <Button
              type="button"
              onClick={() => {
                setIsNoteModalOpen(false);
                setNoteContent('');
                setNotePage(null);
              }}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateNote}
              variant="primary"
              icon={<Save />}
              iconPosition="left"
              loading={savingNote}
              disabled={!noteContent.trim()}
            >
              Save Note
            </Button>
          </div>
        </Stack>
      </HandDrawnModal>
    </>
  );
}

