import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ParagraphProps {
  children: ReactNode;
  className?: string;
  variant?: 'body' | 'secondary' | 'meta';
}

export function Paragraph({ 
  children, 
  className,
  variant = 'body'
}: ParagraphProps) {
  const variantClasses = {
    body: 'text-base leading-reading text-text-primary dark:text-dark-text-primary',
    secondary: 'text-sm leading-normal text-text-secondary dark:text-dark-text-secondary',
    meta: 'text-xs leading-normal text-text-secondary dark:text-dark-text-secondary uppercase tracking-wide',
  };

  return (
    <p className={cn(variantClasses[variant], className)}>
      {children}
    </p>
  );
}

