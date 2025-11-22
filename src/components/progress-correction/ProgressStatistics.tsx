import { Section } from '@/components/ui/layout';
import { Paragraph, MetaText } from '@/components/ui/typography';
import { SessionDto } from '@/hooks/useSessions';
import { BookDto } from '@/hooks/useBooks';

interface ProgressStatisticsProps {
  sessions: SessionDto[];
  book: BookDto;
}

export function ProgressStatistics({ sessions, book }: ProgressStatisticsProps) {
  const totalPagesRead = sessions.reduce((sum, s) => sum + (s.pages_read || 0), 0);

  return (
    <Section padding="md">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <MetaText className="text-xs">Total Sessions</MetaText>
          <Paragraph className="text-2xl font-bold mt-1">{sessions.length}</Paragraph>
        </div>
        <div>
          <MetaText className="text-xs">Total Pages Read</MetaText>
          <Paragraph className="text-2xl font-bold mt-1">{totalPagesRead}</Paragraph>
        </div>
        <div>
          <MetaText className="text-xs">Current Page</MetaText>
          <Paragraph className="text-2xl font-bold mt-1">
            {book.current_page_text} / {book.total_pages || '?'}
          </Paragraph>
        </div>
      </div>
    </Section>
  );
}

