import { useNavigate } from 'react-router-dom';
import { Section } from '@/components/ui/layout';
import { Heading, Paragraph } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';
import { BookOpen } from 'lucide-react';

export function NoActiveReading() {
  const navigate = useNavigate();

  return (
    <Section padding="lg">
      <div className="text-center py-8">
        <BookOpen className="w-16 h-16 mx-auto text-text-secondary dark:text-dark-text-secondary mb-4" />
        <Heading level={3}>No active reading</Heading>
        <Paragraph variant="secondary" className="mt-2 mb-4">
          Start a new book from your library
        </Paragraph>
        <Button
          onClick={() => navigate('/library')}
          variant="primary"
        >
          Go to Library
        </Button>
      </div>
    </Section>
  );
}

