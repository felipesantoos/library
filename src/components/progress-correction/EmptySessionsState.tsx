import { Section } from '@/components/ui/layout';
import { Paragraph } from '@/components/ui/typography';

export function EmptySessionsState() {
  return (
    <Section padding="lg">
      <div className="text-center py-12">
        <Paragraph>No sessions to correct</Paragraph>
      </div>
    </Section>
  );
}

