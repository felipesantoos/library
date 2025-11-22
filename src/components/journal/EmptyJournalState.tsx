import { Section } from '@/components/ui/layout';
import { Heading, Paragraph } from '@/components/ui/typography';
import { BookOpen } from 'lucide-react';

export function EmptyJournalState() {
  return (
    <Section padding="lg">
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 mx-auto text-text-secondary mb-4" />
        <Heading level={3}>No journal entries yet</Heading>
        <Paragraph variant="secondary" className="mt-2">
          Start writing to reflect on your reading journey
        </Paragraph>
      </div>
    </Section>
  );
}

