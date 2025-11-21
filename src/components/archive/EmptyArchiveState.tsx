import { Section } from '@/components/ui/layout';
import { Heading, Paragraph } from '@/components/ui/typography';
import { Archive } from 'lucide-react';

export function EmptyArchiveState() {
  return (
    <Section padding="lg">
      <div className="text-center py-12">
        <Archive className="w-16 h-16 mx-auto text-text-secondary mb-4" />
        <Heading level={3}>No archived books</Heading>
        <Paragraph variant="secondary" className="mt-2">
          Archive books you're not currently reading to keep your library organized
        </Paragraph>
      </div>
    </Section>
  );
}

