import React from 'react';
import { AgendaBlockDto } from '@/hooks/useAgendaBlocks';
import { SessionEvent, Book } from './types';
import { Section, Stack } from '@/components/ui/layout';
import { Heading } from '@/components/ui/typography';
import { DaySummary } from './DaySummary';
import { PlannedBlocksList } from './PlannedBlocksList';
import { SessionsList } from './SessionsList';
import { formatDateDisplay } from './utils/dateUtils';

interface DayDetailsProps {
  date: string;
  blocks: AgendaBlockDto[];
  sessions: SessionEvent[];
  books: Book[];
  onEdit: (block: AgendaBlockDto) => void;
  onDelete: (id: number) => void;
}

export function DayDetails({
  date,
  blocks,
  sessions,
  books,
  onEdit,
  onDelete,
}: DayDetailsProps) {
  if (blocks.length === 0 && sessions.length === 0) {
    return null;
  }

  return (
    <Section padding="md">
      <Stack spacing="md">
        <Heading level={3}>
          {formatDateDisplay(date, { weekday: 'long', month: 'long', day: 'numeric' })}
        </Heading>

        <DaySummary sessions={sessions} />

        <PlannedBlocksList
          blocks={blocks}
          books={books}
          onEdit={onEdit}
          onDelete={onDelete}
        />

        <SessionsList sessions={sessions} books={books} />
      </Stack>
    </Section>
  );
}

