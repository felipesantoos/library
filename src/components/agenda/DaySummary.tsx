import React from 'react';
import { MetaText, Paragraph } from '@/components/ui/typography';
import { SessionEvent } from './types';

interface DaySummaryProps {
  sessions: SessionEvent[];
}

export function DaySummary({ sessions }: DaySummaryProps) {
  const totalMinutes = sessions.reduce((sum, s) => sum + (s.minutes_read || 0), 0);
  const totalPages = sessions.reduce((sum, s) => sum + (s.pages_read || 0), 0);

  if (totalMinutes === 0 && totalPages === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-4 bg-background-surface rounded-md">
      <div>
        <MetaText>Total Pages</MetaText>
        <Paragraph className="text-2xl font-bold">{totalPages}</Paragraph>
      </div>
      <div>
        <MetaText>Total Minutes</MetaText>
        <Paragraph className="text-2xl font-bold">{totalMinutes}</Paragraph>
      </div>
    </div>
  );
}

