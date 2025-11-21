import React from 'react';
import { cn } from '@/lib/utils';

interface AntiqueArrowProps {
  direction?: 'left' | 'right' | 'down';
  className?: string;
  size?: number;
}

export function AntiqueArrow({ 
  direction = 'left', 
  className,
  size = 16 
}: AntiqueArrowProps) {
  const isLeft = direction === 'left';
  const isRight = direction === 'right';
  const isDown = direction === 'down';

  // Vintage arrow with quill-like style - more organic, hand-drawn feel
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('flex-shrink-0', className)}
    >
      {isLeft && (
        <g>
          {/* Main arrow body with slight curve for vintage feel */}
          <path
            d="M10.5 3.5L6.2 8L10.5 12.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.9"
          />
          {/* Arrowhead with vintage style */}
          <path
            d="M6.2 8L3 5.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.9"
          />
          <path
            d="M6.2 8L3 10.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.9"
          />
        </g>
      )}
      {isRight && (
        <g>
          {/* Main arrow body */}
          <path
            d="M5.5 3.5L9.8 8L5.5 12.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.9"
          />
          {/* Arrowhead */}
          <path
            d="M9.8 8L13 5.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.9"
          />
          <path
            d="M9.8 8L13 10.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.9"
          />
        </g>
      )}
      {isDown && (
        <g>
          {/* Main arrow body */}
          <path
            d="M3.5 5.5L8 9.8L12.5 5.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.9"
          />
          {/* Arrowhead */}
          <path
            d="M8 9.8L5.5 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.9"
          />
          <path
            d="M8 9.8L10.5 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.9"
          />
        </g>
      )}
    </svg>
  );
}

