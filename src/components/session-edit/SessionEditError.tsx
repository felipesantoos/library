import { Section } from '@/components/ui/layout';
import { Paragraph } from '@/components/ui/typography';

interface SessionEditErrorProps {
  error: string;
}

export function SessionEditError({ error }: SessionEditErrorProps) {
  return (
    <Section padding="sm" className="bg-semantic-error/10 border-semantic-error">
      <Paragraph variant="secondary" className="text-semantic-error">
        {error}
      </Paragraph>
    </Section>
  );
}

