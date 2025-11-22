import { Section } from '@/components/ui/layout';
import { Heading, Paragraph } from '@/components/ui/typography';
import { Calendar, FileText, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  type: 'sessions' | 'notes' | 'summary';
}

export function EmptyState({ type }: EmptyStateProps) {
  const config = {
    sessions: {
      icon: Calendar,
      title: 'No sessions yet',
      message: 'Start a reading session to track your progress',
    },
    notes: {
      icon: FileText,
      title: 'No notes yet',
      message: 'Add notes to this book',
    },
    summary: {
      icon: Sparkles,
      title: 'No Summary Available',
      message: 'Add notes to generate an automatic summary',
    },
  };

  const { icon: Icon, title, message } = config[type];

  return (
    <Section padding="lg">
      <div className="text-center py-12">
        <Icon className="w-16 h-16 mx-auto text-text-secondary mb-4" />
        <Heading level={3}>{title}</Heading>
        <Paragraph variant="secondary" className="mt-2">
          {message}
        </Paragraph>
      </div>
    </Section>
  );
}

