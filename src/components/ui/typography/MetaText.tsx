import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MetaTextProps {
  children: ReactNode;
  className?: string;
}

export function MetaText({ children, className }: MetaTextProps) {
  return (
    <span 
      className={cn(
        'text-xs',
        'text-text-secondary dark:text-dark-text-secondary',
        'uppercase tracking-wide',
        'font-medium',
        className
      )}
    >
      {children}
    </span>
  );
}

