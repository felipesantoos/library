import React from 'react';
import { AgendaBlockDto } from '@/hooks/useAgendaBlocks';
import { Book } from './types';
import { Heading } from '@/components/ui/typography';
import { Stack } from '@/components/ui/layout';
import { AgendaBlockCard } from './AgendaBlockCard';

interface PlannedBlocksListProps {
  blocks: AgendaBlockDto[];
  books: Book[];
  onEdit: (block: AgendaBlockDto) => void;
  onDelete: (id: number) => void;
}

export function PlannedBlocksList({ blocks, books, onEdit, onDelete }: PlannedBlocksListProps) {
  if (blocks.length === 0) {
    return null;
  }

  return (
    <div>
      <Heading level={4} className="text-base mb-2">Planned Blocks</Heading>
      <Stack spacing="sm">
        {blocks.map((block) => {
          const book = block.book_id ? books.find(b => b.id === block.book_id) : null;
          return (
            <AgendaBlockCard
              key={block.id}
              block={block}
              book={book || null}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          );
        })}
      </Stack>
    </div>
  );
}

