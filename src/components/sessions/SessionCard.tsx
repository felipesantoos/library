import { SessionDto } from '@/hooks/useSessions';
import { BookDto } from '@/hooks/useBooks';
import { Section, Stack } from '@/components/ui/layout';
import { Heading, Paragraph } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';
import { BookOpen, Clock, Edit, Trash2 } from 'lucide-react';

interface SessionCardProps {
  session: SessionDto;
  book: BookDto | null;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function SessionCard({ session, book, onEdit, onDelete }: SessionCardProps) {
  return (
    <Section padding="md" className="hover:shadow-medium transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Stack spacing="sm">
            <div className="flex items-center space-x-3">
              {book ? (
                <>
                  <BookOpen className="w-5 h-5 text-text-secondary" />
                  <div>
                    <Heading level={4} className="text-base">
                      {book.title}
                    </Heading>
                    {book.author && (
                      <Paragraph variant="secondary" className="text-sm mt-0">
                        {book.author}
                      </Paragraph>
                    )}
                  </div>
                </>
              ) : (
                <Paragraph variant="secondary">Book not found</Paragraph>
              )}
            </div>

            <div className="flex items-center space-x-4 text-sm text-text-secondary">
              {session.start_time && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {session.start_time.substring(0, 5)}
                    {session.end_time && ` - ${session.end_time.substring(0, 5)}`}
                  </span>
                </div>
              )}

              {session.duration_formatted && (
                <span>Duration: {session.duration_formatted}</span>
              )}

              {session.pages_read && session.pages_read > 0 && (
                <span>Pages: {session.start_page} → {session.end_page} ({session.pages_read} pages)</span>
              )}

              {session.minutes_read && session.minutes_read > 0 && (
                <span>Minutes: {session.minutes_read}</span>
              )}
            </div>

            {session.notes && (
              <Paragraph variant="secondary" className="text-sm italic">
                "{session.notes}"
              </Paragraph>
            )}
          </Stack>
        </div>

        {session.id && (
          <div className="flex items-center space-x-1">
            <Button
              onClick={() => onEdit(session.id!)}
              variant="ghost"
              size="sm"
              iconOnly
              icon={<Edit className="w-4 h-4" />}
              aria-label="Edit session"
            />
            <Button
              onClick={() => onDelete(session.id!)}
              variant="ghost"
              size="sm"
              iconOnly
              icon={<Trash2 className="w-4 h-4" />}
              aria-label="Delete session"
            />
          </div>
        )}
      </div>
    </Section>
  );
}

