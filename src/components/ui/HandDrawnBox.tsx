import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { HandDrawnBorder } from './HandDrawnBorder';

interface HandDrawnBoxProps {
  children: React.ReactNode;
  className?: string;
  borderRadius?: number;
  strokeWidth?: number;
  color?: string;
  sides?: 'all' | 'top' | 'right' | 'bottom' | 'left' | 'top-right' | 'top-bottom' | 'top-left' | 'right-bottom' | 'right-left' | 'bottom-left' | 'top-right-bottom' | 'top-right-left' | 'top-bottom-left' | 'right-bottom-left';
  // Remove border from className if present
  removeBorderClass?: boolean;
}

export function HandDrawnBox({
  children,
  className,
  borderRadius = 8,
  strokeWidth = 1,
  color,
  sides = 'all',
  removeBorderClass = true,
}: HandDrawnBoxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Remove border classes if removeBorderClass is true
  const processedClassName = removeBorderClass && className
    ? className
        .replace(/\bborder\b/g, '')
        .replace(/\bborder-[^\s]*/g, '')
        .trim()
    : className;

  // Get color from computed styles if not provided
  const borderColor = color || 'currentColor';

  return (
    <div
      ref={containerRef}
      className={cn('relative', processedClassName)}
      style={{ border: 'none' }}
    >
      {dimensions.width > 0 && dimensions.height > 0 && (
        <HandDrawnBorder
          width={dimensions.width}
          height={dimensions.height}
          borderRadius={borderRadius}
          strokeWidth={strokeWidth}
          color={borderColor}
          sides={sides}
        />
      )}
      {children}
    </div>
  );
}

