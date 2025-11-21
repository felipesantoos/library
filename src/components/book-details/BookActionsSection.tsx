import { useNavigate } from 'react-router-dom';
import { BookDto } from '@/hooks/useBooks';
import { Button } from '@/components/ui/Button';
import { Calendar, Repeat } from 'lucide-react';
import { createReading } from '@/hooks/useReadings';
import { toast } from '@/utils/toast';

interface BookActionsSectionProps {
  book: BookDto;
  selectedReadingId: number | null;
  readingsCount: number;
  onRefresh: () => void;
  onRefreshReadings: () => void;
  onRefreshCurrentReading: () => void;
}

export function BookActionsSection({
  book,
  selectedReadingId,
  readingsCount,
  onRefresh,
  onRefreshReadings,
  onRefreshCurrentReading,
}: BookActionsSectionProps) {
  const navigate = useNavigate();

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

  return (
    <div className="flex items-center space-x-3 pt-4 flex-wrap gap-2">
      <Button
        onClick={() => navigate(`/session/new?bookId=${book.id}${selectedReadingId ? `&readingId=${selectedReadingId}` : ''}`)}
        variant="primary"
        icon={<Calendar className="w-4 h-4" />}
        iconPosition="left"
      >
        Start Session
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
  );
}

