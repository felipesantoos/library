import React from 'react';
import { AgendaBlockDto } from '@/hooks/useAgendaBlocks';
import { Book } from './types';
import { formatTime } from './utils/dateUtils';
import { Button } from '@/components/ui/Button';
import { Paragraph, MetaText } from '@/components/ui/typography';
import { Stack } from '@/components/ui/layout';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { BookOpen, CheckCircle, Edit2, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgendaBlockCardProps {
  block: AgendaBlockDto;
  book: Book | null;
  onEdit: (block: AgendaBlockDto) => void;
  onDelete: (id: number) => void;
}

export function AgendaBlockCard({ block, book, onEdit, onDelete }: AgendaBlockCardProps) {
  return (
    <HandDrawnBox
      borderRadius={6}
      strokeWidth={1}
      linearCorners={true}
      className={cn(
        "p-3",
        block.is_completed
          ? "bg-semantic-success/10"
          : "bg-accent-primary/10"
      )}
      color={block.is_completed ? 'rgb(34, 197, 94)' : 'rgb(46, 74, 120)'}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Stack spacing="sm">
            {block.start_time && block.end_time && (
              <MetaText className="text-xs">
                {formatTime(block.start_time)} - {formatTime(block.end_time)}
              </MetaText>
            )}
            {book && (
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-accent-primary" />
                <Paragraph className="text-sm font-medium">{book.title}</Paragraph>
              </div>
            )}
            {block.notes && (
              <Paragraph variant="secondary" className="text-sm">{block.notes}</Paragraph>
            )}
            {block.is_completed && (
              <div className="flex items-center space-x-1 text-xs text-semantic-success">
                <CheckCircle className="w-3 h-3" />
                <span>Completed</span>
              </div>
            )}
          </Stack>
        </div>
        {block.id && (
          <div className="flex items-center space-x-2 ml-4">
            <Button
              onClick={() => onEdit(block)}
              variant="ghost"
              size="sm"
              iconOnly
              icon={<Edit2 className="w-4 h-4" />}
              aria-label="Edit block"
            />
            <Button
              onClick={() => onDelete(block.id!)}
              variant="ghost"
              size="sm"
              iconOnly
              icon={<Trash2 className="w-4 h-4" />}
              aria-label="Delete block"
            />
          </div>
        )}
      </div>
    </HandDrawnBox>
  );
}

