import { useNavigate } from 'react-router-dom';
import { Stack, Section } from '@/components/ui/layout';
import { Button } from '@/components/ui/Button';
import { SessionDto } from '@/hooks/useSessions';
import { BookDto } from '@/hooks/useBooks';
import { SessionCard } from './SessionCard';
import { EmptyState } from './EmptyState';
import { Settings } from 'lucide-react';

interface SessionsTabProps {
  book: BookDto;
  sessions: SessionDto[];
  onEdit: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function SessionsTab({ book, sessions, onEdit, onDelete }: SessionsTabProps) {
  const navigate = useNavigate();

  if (sessions.length === 0) {
    return <EmptyState type="sessions" />;
  }

  return (
    <Stack spacing="sm">
      {sessions.length > 0 && (
        <Section padding="sm">
          <Button
            onClick={() => navigate(`/book/${book.id}/progress-correction`)}
            variant="outline"
            icon={<Settings className="w-4 h-4" />}
            iconPosition="left"
          >
            Correct Progress
          </Button>
        </Section>
      )}

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

