import React from 'react';
import { AgendaBlockDto } from '@/hooks/useAgendaBlocks';
import { SessionEvent, Book } from './types';
import { formatTime } from './utils/dateUtils';
import { Clock, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarEventProps {
  event: AgendaBlockDto | SessionEvent;
  type: 'session' | 'block';
  onClick?: () => void;
  book?: Book | null;
}

export function CalendarEvent({ event, type, onClick, book }: CalendarEventProps) {
  if (type === 'session') {
    const session = event as SessionEvent;
    return (
      <div
        className="text-xs p-1 rounded bg-semantic-success/20 text-semantic-success truncate"
        title={`Session: ${session.pages_read || 0} pages`}
      >
        <Clock className="w-3 h-3 inline mr-1" />
        {session.pages_read || 0}p
      </div>
    );
  }

  const block = event as AgendaBlockDto;
  return (
    <div
      className={cn(
        "text-xs p-1 rounded truncate cursor-pointer",
        block.is_completed
          ? "bg-semantic-success/20 text-semantic-success"
          : "bg-accent-primary/20 text-accent-primary"
      )}
      onClick={onClick}
      title={`${block.start_time ? formatTime(block.start_time) : ''} ${book?.title || 'Reading'}`}
    >
      {block.start_time && formatTime(block.start_time)}
      {book && (
        <BookOpen className="w-3 h-3 inline ml-1" />
      )}
    </div>
  );
}

