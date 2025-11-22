import { Section } from '@/components/ui/layout';
import { Heading, Paragraph } from '@/components/ui/typography';
import { FileText } from 'lucide-react';

export function EmptyNotesState() {
  return (
    <Section padding="lg">
      <div className="text-center py-12">
        <FileText className="w-16 h-16 mx-auto text-text-secondary mb-4" />
        <Heading level={3}>No notes yet</Heading>
        <Paragraph variant="secondary" className="mt-2">
          Create your first note or highlight to get started
        </Paragraph>
      </div>
    </Section>
  );
}

