import { Stack } from '@/components/ui/layout';
import { BookDto } from '@/hooks/useBooks';
import { SessionDto } from '@/hooks/useSessions';
import { ProgressChart } from './ProgressChart';
import { StatisticsSection } from './StatisticsSection';
import { BookProgressSection } from './BookProgressSection';

interface OverviewTabProps {
  book: BookDto;
  sessions: SessionDto[];
  notesCount: number;
  progressData: Array<{ date: string; progress: number; cumulative?: number }>;
  onRefresh?: () => void;
  onRefreshSessions?: () => void;
}

export function OverviewTab({ book, sessions, notesCount, progressData, onRefresh, onRefreshSessions }: OverviewTabProps) {
  const handleSessionCreated = async () => {
    if (onRefreshSessions) {
      await onRefreshSessions();
    }
  };

  return (
    <Stack spacing="md">
      <StatisticsSection book={book} sessions={sessions} notesCount={notesCount} />
      <BookProgressSection 
        book={book} 
        onRefresh={onRefresh}
        onSessionCreated={handleSessionCreated}
      />
      <ProgressChart data={progressData} totalPages={book.total_pages || undefined} />
    </Stack>
  );
}

