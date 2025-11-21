import { SessionDto } from '@/hooks/useSessions';
import { Section, Stack } from '@/components/ui/layout';
import { MetaText, Paragraph } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';
import { Edit } from 'lucide-react';

interface SessionCardProps {
  session: SessionDto;
  onEdit: (id: number) => void;
}

export function SessionCard({ session, onEdit }: SessionCardProps) {
  return (
    <Section padding="md" className="hover:shadow-medium transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Stack spacing="sm">
            <div className="flex items-center space-x-3">
              <MetaText>{new Date(session.session_date).toLocaleDateString()}</MetaText>
              {session.start_time && (
                <MetaText>
                  {session.start_time.substring(0, 5)}
                  {session.end_time && ` - ${session.end_time.substring(0, 5)}`}
                </MetaText>
              )}
            </div>
            {session.pages_read && session.pages_read > 0 && (
              <Paragraph className="text-sm">
                Pages: {session.start_page} → {session.end_page} ({session.pages_read} pages)
              </Paragraph>
            )}
            {session.minutes_read && session.minutes_read > 0 && (
              <Paragraph className="text-sm">
                Minutes: {session.minutes_read}
              </Paragraph>
            )}
            {session.duration_formatted && (
              <MetaText>Duration: {session.duration_formatted}</MetaText>
            )}
            {session.notes && (
              <Paragraph variant="secondary" className="text-sm italic">
                "{session.notes}"
              </Paragraph>
            )}
          </Stack>
        </div>
        {session.id && (
          <Button
            onClick={() => onEdit(session.id!)}
            variant="ghost"
            size="sm"
            iconOnly
            icon={<Edit className="w-4 h-4" />}
            aria-label="Edit session"
          />
        )}
      </div>
    </Section>
  );
}

