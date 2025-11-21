import { Section, Stack } from '@/components/ui/layout';
import { Heading, Paragraph, MetaText } from '@/components/ui/typography';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { StatisticsDto } from '@/hooks/useGoals';

interface StatisticsOverviewProps {
  statistics: StatisticsDto | null;
  loading: boolean;
  error: string | null;
}

export function StatisticsOverview({ statistics, loading, error }: StatisticsOverviewProps) {
  if (loading) {
    return (
      <Section padding="lg">
        <Paragraph>Loading statistics...</Paragraph>
      </Section>
    );
  }

  if (error) {
    return (
      <Section padding="lg">
        <Paragraph variant="secondary" className="text-semantic-error">
          Error: {error}
        </Paragraph>
      </Section>
    );
  }

  if (!statistics) {
    return null;
  }

  return (
    <Section padding="md">
      <Stack spacing="md">
        <Heading level={3}>Statistics Overview</Heading>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="p-4 bg-background-surface">
            <MetaText className="block mb-1">Total Pages</MetaText>
            <Paragraph className="text-2xl font-bold">{statistics.total_pages_read}</Paragraph>
          </HandDrawnBox>
          <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="p-4 bg-background-surface">
            <MetaText className="block mb-1">Books Completed</MetaText>
            <Paragraph className="text-2xl font-bold">{statistics.books_completed}</Paragraph>
          </HandDrawnBox>
          <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="p-4 bg-background-surface">
            <MetaText className="block mb-1">This Month</MetaText>
            <Paragraph className="text-2xl font-bold">{statistics.pages_read_this_month}</Paragraph>
          </HandDrawnBox>
          <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="p-4 bg-background-surface">
            <MetaText className="block mb-1">Avg Pages/Session</MetaText>
            <Paragraph className="text-2xl font-bold">
              {statistics.average_pages_per_session.toFixed(1)}
            </Paragraph>
          </HandDrawnBox>
        </div>
      </Stack>
    </Section>
  );
}

