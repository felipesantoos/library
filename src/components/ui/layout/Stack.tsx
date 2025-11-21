import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StackProps {
  children: ReactNode;
  className?: string;
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  direction?: 'row' | 'col';
}

export function Stack({ 
  children, 
  className,
  spacing = 'md',
  direction = 'col'
}: StackProps) {
  const spacingClasses = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
  };

  return (
    <div 
      className={cn(
        'flex',
        directionClasses[direction],
        spacingClasses[spacing],
        className
      )}
    >
      {children}
    </div>
  );
}

