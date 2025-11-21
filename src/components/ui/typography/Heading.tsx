import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface HeadingProps {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export function Heading({ children, level = 1, className }: HeadingProps) {
  const baseClasses = 'font-heading font-semibold text-text-primary dark:text-dark-text-primary';
  
  const levelClasses = {
    1: 'text-3xl leading-tight',
    2: 'text-2xl leading-tight',
    3: 'text-xl leading-normal',
    4: 'text-lg leading-normal',
    5: 'text-base leading-normal',
    6: 'text-sm leading-normal',
  };

  const Component = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Component 
      className={cn(baseClasses, levelClasses[level], className)}
    >
      {children}
    </Component>
  );
}

