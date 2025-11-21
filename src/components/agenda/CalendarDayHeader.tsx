import React from 'react';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CalendarDayHeaderProps {
  days?: string[];
}

export function CalendarDayHeader({ days = DAYS_OF_WEEK }: CalendarDayHeaderProps) {
  return (
    <div className="grid grid-cols-7">
      {days.map((day) => (
        <HandDrawnBox
          key={day}
          borderRadius={4}
          strokeWidth={1}
          linearCorners={true}
          className="p-2 text-center text-sm font-medium text-text-secondary bg-background-surface"
        >
          {day}
        </HandDrawnBox>
      ))}
    </div>
  );
}

