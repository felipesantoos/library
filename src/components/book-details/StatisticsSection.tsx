import { Section, Stack } from '@/components/ui/layout';
import { Heading, MetaText, Paragraph } from '@/components/ui/typography';
import { SessionDto } from '@/hooks/useSessions';
import { BookDto } from '@/hooks/useBooks';

interface StatisticsSectionProps {
  book: BookDto;
  sessions: SessionDto[];
  notesCount: number;
}

export function StatisticsSection({ book, sessions, notesCount }: StatisticsSectionProps) {
  const totalPagesRead = sessions.reduce((sum, s) => sum + (s.pages_read || 0), 0);

  return (
    <Section padding="md">
      <Stack spacing="sm">
        <Heading level={4}>Statistics</Heading>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <MetaText>Total Sessions</MetaText>
            <Paragraph className="text-2xl font-bold mt-1">{sessions.length}</Paragraph>
          </div>
          <div>
            <MetaText>Total Pages Read</MetaText>
            <Paragraph className="text-2xl font-bold mt-1">{totalPagesRead}</Paragraph>
          </div>
          <div>
            <MetaText>Total Notes</MetaText>
            <Paragraph className="text-2xl font-bold mt-1">{notesCount}</Paragraph>
          </div>
          {book.added_at && (
            <div>
              <MetaText>Added</MetaText>
              <Paragraph className="text-sm mt-1">
                {new Date(book.added_at).toLocaleDateString()}
              </Paragraph>
            </div>
          )}
        </div>
      </Stack>
    </Section>
  );
}

