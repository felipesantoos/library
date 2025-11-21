import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';

interface SectionProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Section({ 
  children, 
  className,
  padding = 'md'
}: SectionProps) {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <HandDrawnBox
      borderRadius={8}
      strokeWidth={1}
      className={cn(
        'rounded-md',
        'bg-background-surface dark:bg-dark-background-surface',
        'shadow-soft',
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </HandDrawnBox>
  );
}

