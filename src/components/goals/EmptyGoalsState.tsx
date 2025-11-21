import { Section } from '@/components/ui/layout';
import { Heading, Paragraph } from '@/components/ui/typography';
import { Target } from 'lucide-react';

export function EmptyGoalsState() {
  return (
    <Section padding="lg">
      <div className="text-center py-12">
        <Target className="w-16 h-16 mx-auto text-text-secondary mb-4" />
        <Heading level={3}>No goals set</Heading>
        <Paragraph variant="secondary" className="mt-2">
          Create a goal to start tracking your reading progress
        </Paragraph>
      </div>
    </Section>
  );
}

