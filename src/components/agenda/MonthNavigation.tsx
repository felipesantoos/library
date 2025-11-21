import React from 'react';
import { Heading } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDateDisplay } from './utils/dateUtils';

interface MonthNavigationProps {
  currentDate: Date;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export function MonthNavigation({ currentDate, onNavigate }: MonthNavigationProps) {
  return (
    <div className="flex items-center justify-between">
      <Button
        onClick={() => onNavigate('prev')}
        variant="ghost"
        size="sm"
        iconOnly
        icon={<ChevronLeft className="w-5 h-5" />}
        aria-label="Previous month"
      />
      <Heading level={2}>
        {formatDateDisplay(currentDate)}
      </Heading>
      <Button
        onClick={() => onNavigate('next')}
        variant="ghost"
        size="sm"
        iconOnly
        icon={<ChevronRight className="w-5 h-5" />}
        aria-label="Next month"
      />
    </div>
  );
}

