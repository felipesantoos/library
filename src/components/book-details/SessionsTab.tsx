import { Stack } from '@/components/ui/layout';
import { SessionDto } from '@/hooks/useSessions';
import { BookDto } from '@/hooks/useBooks';
import { SessionCard } from './SessionCard';
import { EmptyState } from './EmptyState';

interface SessionsTabProps {
  book: BookDto;
  sessions: SessionDto[];
  onEdit: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function SessionsTab({ book, sessions, onEdit, onDelete }: SessionsTabProps) {

  if (sessions.length === 0) {
    return <EmptyState type="sessions" />;
  }

  return (
    <Stack spacing="sm">
      {sessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Stack>
  );
}

