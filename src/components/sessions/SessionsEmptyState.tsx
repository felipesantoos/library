import { Section } from '@/components/ui/layout';
import { Heading, Paragraph } from '@/components/ui/typography';
import { Clock } from 'lucide-react';

export function SessionsEmptyState() {
  return (
    <Section padding="lg">
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto text-text-secondary mb-4" />
        <Heading level={3}>No sessions recorded</Heading>
        <Paragraph variant="secondary" className="mt-2">
          Start a reading session to track your progress
        </Paragraph>
      </div>
    </Section>
  );
}

