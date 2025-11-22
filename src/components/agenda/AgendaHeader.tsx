import React from 'react';
import { Heading, Paragraph } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

interface AgendaHeaderProps {
  onNewBlockClick: () => void;
  showForm?: boolean;
}

export function AgendaHeader({ onNewBlockClick, showForm }: AgendaHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Heading level={1}>Agenda</Heading>
        <Paragraph variant="secondary" className="mt-2">
          Plan your reading schedule and track sessions
        </Paragraph>
      </div>
      <Button
        onClick={onNewBlockClick}
        variant="primary"
        icon={<Plus />}
        iconPosition="left"
      >
        New Block
      </Button>
    </div>
  );
}

