import { Heading, Paragraph } from '@/components/ui/typography';

interface SessionsHeaderProps {
  sessionsCount: number;
}

export function SessionsHeader({ sessionsCount }: SessionsHeaderProps) {
  return (
    <div>
        <Heading level={1}>Sessions</Heading>
      <Paragraph variant="secondary" className="mt-2">
        {sessionsCount} {sessionsCount === 1 ? 'session' : 'sessions'} recorded
      </Paragraph>
    </div>
  );
}

