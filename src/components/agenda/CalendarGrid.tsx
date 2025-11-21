import React from 'react';
import { CalendarDayHeader } from './CalendarDayHeader';
import { CalendarDayCell } from './CalendarDayCell';
import { DayEvents, Book } from './types';
import { isSameDay } from './utils/dateUtils';

interface CalendarGridProps {
  days: Date[];
  eventsByDate: Map<string, DayEvents>;
  selectedDate: Date;
  onBlockClick: (blockId: number) => void;
  books: Book[];
  loading?: boolean;
  error?: string | null;
}

export function CalendarGrid({
  days,
  eventsByDate,
  selectedDate,
  onBlockClick,
  books,
  loading,
  error,
}: CalendarGridProps) {
  if (loading) {
    return <div className="p-4 text-center text-text-secondary">Loading calendar...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-semantic-error">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-1">
      <CalendarDayHeader />
      
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === selectedDate.getMonth();
          const isToday = isSameDay(day, new Date());
          const dateStr = day.toISOString().split('T')[0];
          const events = eventsByDate.get(dateStr) || { blocks: [], sessions: [] };
          
          return (
            <CalendarDayCell
              key={index}
              day={day}
              isCurrentMonth={isCurrentMonth}
              isToday={isToday}
              events={events}
              onBlockClick={onBlockClick}
              books={books}
            />
          );
        })}
      </div>
    </div>
  );
}

