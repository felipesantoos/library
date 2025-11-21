import { Section } from '@/components/ui/layout';
import { Paragraph } from '@/components/ui/typography';

interface BookFormErrorProps {
  error: string;
}

export function BookFormError({ error }: BookFormErrorProps) {
  return (
    <Section padding="sm" className="bg-semantic-error/10 border-semantic-error">
      <Paragraph variant="secondary" className="text-semantic-error">
        {error}
      </Paragraph>
    </Section>
  );
}

