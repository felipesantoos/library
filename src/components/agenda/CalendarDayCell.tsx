import React from 'react';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { CalendarEvent } from './CalendarEvent';
import { DayEvents, Book } from './types';
import { isSameDay } from './utils/dateUtils';
import { cn } from '@/lib/utils';

interface CalendarDayCellProps {
  day: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: DayEvents;
  onBlockClick: (blockId: number) => void;
  books: Book[];
}

export function CalendarDayCell({
  day,
  isCurrentMonth,
  isToday,
  events,
  onBlockClick,
  books,
}: CalendarDayCellProps) {
  return (
    <HandDrawnBox
      borderRadius={4}
      strokeWidth={1}
      linearCorners={true}
      className={cn(
        "min-h-[100px] p-2",
        !isCurrentMonth && "bg-background-surface/50",
        isToday && "bg-accent-primary/10"
      )}
      style={{
        backgroundColor: isToday 
          ? 'rgba(46, 74, 120, 0.1)' 
          : !isCurrentMonth 
            ? 'rgba(248, 243, 232, 0.5)' 
            : undefined
      }}
    >
      <div className={cn(
        "text-sm font-medium mb-1",
        isToday && "text-accent-primary",
        !isCurrentMonth && "text-text-secondary"
      )}>
        {day.getDate()}
      </div>
      
      {/* Events */}
      <div className="space-y-1">
        {/* Sessions */}
        {events.sessions.map((session) => (
          <CalendarEvent
            key={session.id}
            event={session}
            type="session"
            book={books.find(b => b.id === session.book_id) || null}
          />
        ))}
        
        {/* Planned blocks */}
        {events.blocks.slice(0, 2).map((block) => (
          <CalendarEvent
            key={block.id}
            event={block}
            type="block"
            onClick={() => block.id && onBlockClick(block.id)}
            book={block.book_id ? books.find(b => b.id === block.book_id) || null : null}
          />
        ))}
        
        {events.blocks.length > 2 && (
          <div className="text-xs text-text-secondary">
            +{events.blocks.length - 2} more
          </div>
        )}
      </div>
    </HandDrawnBox>
  );
}

