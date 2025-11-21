import { Section, Stack } from '@/components/ui/layout';
import { Heading, Paragraph, MetaText } from '@/components/ui/typography';
import { Calendar } from 'lucide-react';

interface TodayProgressPanelProps {
  pages: number;
  minutes: number;
  sessions: number;
}

export function TodayProgressPanel({ pages, minutes, sessions }: TodayProgressPanelProps) {
  return (
    <Section padding="md">
      <Stack spacing="sm">
        <div className="flex items-center justify-between">
          <Heading level={4}>Today's Progress</Heading>
          <Calendar className="w-5 h-5 text-text-secondary dark:text-dark-text-secondary" />
        </div>
        
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div>
            <MetaText>Pages</MetaText>
            <Paragraph className="text-2xl font-bold mt-1">
              {pages}
            </Paragraph>
          </div>
          <div>
            <MetaText>Minutes</MetaText>
            <Paragraph className="text-2xl font-bold mt-1">
              {minutes}
            </Paragraph>
          </div>
          <div>
            <MetaText>Sessions</MetaText>
            <Paragraph className="text-2xl font-bold mt-1">
              {sessions}
            </Paragraph>
          </div>
        </div>
      </Stack>
    </Section>
  );
}

