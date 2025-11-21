import React from 'react';
import { cn } from '@/lib/utils';

interface HandDrawnCircleProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export function HandDrawnCircle({ 
  className,
  size = 48,
  strokeWidth = 2.5
}: HandDrawnCircleProps) {
  // Hand-drawn circle with organic, imperfect curves
  // Path with intentional variations in each quadrant to simulate hand-drawn effect
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2', className)}
    >
      {/* Hand-drawn circle with organic variations - imperfect curves like drawn by hand */}
      <path
        d="M24 9.8 
           C16.5 10.2, 9.5 16.8, 9.8 24.2
           C10.1 31.5, 17.3 38.1, 24.5 38.3
           C31.9 38.0, 38.3 31.2, 38.1 24.0
           C37.8 16.8, 31.0 9.5, 24 9.8 Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

