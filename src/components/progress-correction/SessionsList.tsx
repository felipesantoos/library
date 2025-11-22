import { SessionDto } from '@/hooks/useSessions';
import { BookDto } from '@/hooks/useBooks';
import { Stack, Section } from '@/components/ui/layout';
import { EditableSessionCard } from './EditableSessionCard';
import { SessionDeleteConfirmation } from './SessionDeleteConfirmation';

interface SessionsListProps {
  sessions: SessionDto[];
  book: BookDto;
  editingSessions: Map<number, Partial<SessionDto>>;
  deletingSessions: Set<number>;
  errors: Map<number, string>;
  warnings: Map<number, string>;
  onEditSession: (sessionId: number, field: keyof SessionDto, value: any) => void;
  onDeleteSession: (sessionId: number) => void;
  onCancelDelete: (sessionId: number) => void;
  onConfirmDelete: (sessionId: number) => Promise<void>;
}

export function SessionsList({
  sessions,
  book,
  editingSessions,
  deletingSessions,
  errors,
  warnings,
  onEditSession,
  onDeleteSession,
  onCancelDelete,
  onConfirmDelete,
}: SessionsListProps) {
  return (
    <Stack spacing="sm">
      {sessions.map((session) => {
        if (!session.id) return null;

        if (deletingSessions.has(session.id)) {
          return (
            <SessionDeleteConfirmation
              key={session.id}
              session={session}
              onConfirm={() => onConfirmDelete(session.id!)}
              onCancel={() => onCancelDelete(session.id!)}
            />
          );
        }

        const edited = editingSessions.get(session.id);
        const displaySession = edited || session;
        const hasError = errors.has(session.id);
        const hasWarning = warnings.has(session.id);
        const isEdited = editingSessions.has(session.id);

        return (
          <EditableSessionCard
            key={session.id}
            session={displaySession}
            originalSession={session}
            book={book}
            hasError={hasError}
            errorMessage={errors.get(session.id)}
            hasWarning={hasWarning}
            warningMessage={warnings.get(session.id)}
            isEdited={isEdited}
            onChange={(field, value) => onEditSession(session.id!, field, value)}
            onDelete={() => onDeleteSession(session.id!)}
          />
        );
      })}
    </Stack>
  );
}

