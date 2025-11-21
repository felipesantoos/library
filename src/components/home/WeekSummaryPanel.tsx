import { Section, Stack } from '@/components/ui/layout';
import { Heading, Paragraph, MetaText } from '@/components/ui/typography';
import { TrendingUp } from 'lucide-react';

interface WeekSummaryPanelProps {
  pages: number;
  daysActive: number;
  sessions: number;
}

export function WeekSummaryPanel({ pages, daysActive, sessions }: WeekSummaryPanelProps) {
  return (
    <Section padding="md">
      <Stack spacing="sm">
        <div className="flex items-center justify-between">
          <Heading level={4}>This Week</Heading>
          <TrendingUp className="w-5 h-5 text-text-secondary dark:text-dark-text-secondary" />
        </div>
        
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <MetaText>Pages Read</MetaText>
            <Paragraph className="font-semibold">{pages}</Paragraph>
          </div>
          <div className="flex items-center justify-between">
            <MetaText>Days Active</MetaText>
            <Paragraph className="font-semibold">{daysActive} / 7</Paragraph>
          </div>
          <div className="flex items-center justify-between">
            <MetaText>Total Sessions</MetaText>
            <Paragraph className="font-semibold">{sessions}</Paragraph>
          </div>
        </div>
      </Stack>
    </Section>
  );
}

