import { Stack } from '@/components/ui/layout';
import { BookDto } from '@/hooks/useBooks';
import { SessionDto } from '@/hooks/useSessions';
import { ProgressChart } from './ProgressChart';
import { StatisticsSection } from './StatisticsSection';

interface OverviewTabProps {
  book: BookDto;
  sessions: SessionDto[];
  notesCount: number;
  progressData: Array<{ date: string; progress: number }>;
}

export function OverviewTab({ book, sessions, notesCount, progressData }: OverviewTabProps) {
  return (
    <Stack spacing="md">
      <StatisticsSection book={book} sessions={sessions} notesCount={notesCount} />
      <ProgressChart data={progressData} />
    </Stack>
  );
}

