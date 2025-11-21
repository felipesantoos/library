import { Section, Stack } from '@/components/ui/layout';
import { Heading, Paragraph, MetaText } from '@/components/ui/typography';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { Award, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MonthStat } from './hooks/useBestMonths';

interface BestMonthsRankingProps {
  bestMonths: MonthStat[];
}

export function BestMonthsRanking({ bestMonths }: BestMonthsRankingProps) {
  if (bestMonths.length === 0) {
    return null;
  }

  return (
    <Section padding="md">
      <Stack spacing="sm">
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-accent-primary" />
          <Heading level={3}>Best Months</Heading>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {bestMonths.map((month, index) => {
            const monthName = new Date(2000, month.month - 1).toLocaleString('en-US', { month: 'long' });
            return (
              <HandDrawnBox
                key={`${month.year}-${month.month}`}
                borderRadius={6}
                strokeWidth={1}
                linearCorners={true}
                className="p-3 bg-background-surface"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-primary">
                    #{index + 1}
                  </span>
                  <Trophy
                    className={cn(
                      "w-4 h-4",
                      index === 0 && "text-yellow-500",
                      index === 1 && "text-gray-400",
                      index === 2 && "text-amber-600"
                    )}
                  />
                </div>
                <Paragraph className="text-sm font-medium">{monthName} {month.year}</Paragraph>
                <MetaText className="text-xs">{month.pages} pages</MetaText>
              </HandDrawnBox>
            );
          })}
        </div>
      </Stack>
    </Section>
  );
}

