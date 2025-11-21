import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

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
    <section 
      className={cn(
        'rounded-md',
        'bg-background-surface dark:bg-dark-background-surface',
        'border border-background-border dark:border-dark-background-border',
        'shadow-soft',
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </section>
  );
}

