import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface HandDrawnBorderProps {
  width: number;
  height: number;
  borderRadius?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
  sides?: 'all' | 'top' | 'right' | 'bottom' | 'left' | 'top-right' | 'top-bottom' | 'top-left' | 'right-bottom' | 'right-left' | 'bottom-left' | 'top-right-bottom' | 'top-right-left' | 'top-bottom-left' | 'right-bottom-left';
}

// Generate hand-drawn path with organic imperfections
function generateHandDrawnPath(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  seed: number
): string {
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  
  // Add small random variations based on seed
  const variation1 = (seed % 5 - 2) * 0.8;
  const variation2 = ((seed * 3) % 5 - 2) * 0.6;
  const variation3 = ((seed * 7) % 5 - 2) * 0.7;
  
  // Create control points with variations
  const cp1X = startX + (midX - startX) * 0.4 + variation1;
  const cp1Y = startY + (midY - startY) * 0.4 + variation2;
  const cp2X = startX + (midX - startX) * 0.6 + variation3;
  const cp2Y = startY + (midY - startY) * 0.6 - variation1;
  
  return `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
}

// Generate rounded corner path with imperfections
function generateRoundedCorner(
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  seed: number
): string {
  const variation = (seed % 3 - 1) * 0.3;
  const adjustedRadius = radius + variation;
  
  const startX = centerX + adjustedRadius * Math.cos(startAngle);
  const startY = centerY + adjustedRadius * Math.sin(startAngle);
  const endX = centerX + adjustedRadius * Math.cos(endAngle);
  const endY = centerY + adjustedRadius * Math.sin(endAngle);
  
  const midAngle = (startAngle + endAngle) / 2;
  const midX = centerX + adjustedRadius * Math.cos(midAngle);
  const midY = centerY + adjustedRadius * Math.sin(midAngle);
  
  // Add small variation to control point
  const cpVariation = ((seed * 2) % 3 - 1) * 0.2;
  const cpX = centerX + (adjustedRadius * 0.7) * Math.cos(midAngle) + cpVariation;
  const cpY = centerY + (adjustedRadius * 0.7) * Math.sin(midAngle) + cpVariation;
  
  return `M ${startX} ${startY} Q ${cpX} ${cpY}, ${endX} ${endY}`;
}

export function HandDrawnBorder({
  width,
  height,
  borderRadius = 0,
  strokeWidth = 1,
  color = 'currentColor',
  className,
  sides = 'all',
}: HandDrawnBorderProps) {
  const paths = useMemo(() => {
    const paths: string[] = [];
    const r = borderRadius;
    const w = width;
    const h = height;
    
    // Check which sides to draw
    const drawTop = sides === 'all' || sides.includes('top');
    const drawRight = sides === 'all' || sides.includes('right');
    const drawBottom = sides === 'all' || sides.includes('bottom');
    const drawLeft = sides === 'all' || sides.includes('left');
    
    if (r === 0) {
      // No rounded corners - simple straight lines with imperfections
      if (drawTop) {
        paths.push(generateHandDrawnPath(0, 0, w, 0, 1));
      }
      if (drawRight) {
        paths.push(generateHandDrawnPath(w, 0, w, h, 2));
      }
      if (drawBottom) {
        paths.push(generateHandDrawnPath(w, h, 0, h, 3));
      }
      if (drawLeft) {
        paths.push(generateHandDrawnPath(0, h, 0, 0, 4));
      }
    } else {
      // With rounded corners
      const cornerRadius = Math.min(r, w / 2, h / 2);
      
      // Top-left corner
      if (drawTop && drawLeft) {
        paths.push(generateRoundedCorner(cornerRadius, cornerRadius, cornerRadius, Math.PI, Math.PI / 2, 1));
      } else if (drawTop) {
        paths.push(generateHandDrawnPath(0, 0, cornerRadius, 0, 1));
      } else if (drawLeft) {
        paths.push(generateHandDrawnPath(0, cornerRadius, 0, 0, 1));
      }
      
      // Top edge
      if (drawTop) {
        paths.push(generateHandDrawnPath(cornerRadius, 0, w - cornerRadius, 0, 2));
      }
      
      // Top-right corner
      if (drawTop && drawRight) {
        paths.push(generateRoundedCorner(w - cornerRadius, cornerRadius, cornerRadius, Math.PI / 2, 0, 3));
      } else if (drawTop) {
        paths.push(generateHandDrawnPath(w - cornerRadius, 0, w, 0, 3));
      } else if (drawRight) {
        paths.push(generateHandDrawnPath(w, cornerRadius, w, 0, 3));
      }
      
      // Right edge
      if (drawRight) {
        paths.push(generateHandDrawnPath(w, cornerRadius, w, h - cornerRadius, 4));
      }
      
      // Bottom-right corner
      if (drawRight && drawBottom) {
        paths.push(generateRoundedCorner(w - cornerRadius, h - cornerRadius, cornerRadius, 0, -Math.PI / 2, 5));
      } else if (drawRight) {
        paths.push(generateHandDrawnPath(w, h - cornerRadius, w, h, 5));
      } else if (drawBottom) {
        paths.push(generateHandDrawnPath(w - cornerRadius, h, w, h, 5));
      }
      
      // Bottom edge
      if (drawBottom) {
        paths.push(generateHandDrawnPath(w - cornerRadius, h, cornerRadius, h, 6));
      }
      
      // Bottom-left corner
      if (drawBottom && drawLeft) {
        paths.push(generateRoundedCorner(cornerRadius, h - cornerRadius, cornerRadius, -Math.PI / 2, Math.PI, 7));
      } else if (drawBottom) {
        paths.push(generateHandDrawnPath(cornerRadius, h, 0, h, 7));
      } else if (drawLeft) {
        paths.push(generateHandDrawnPath(0, h - cornerRadius, 0, h, 7));
      }
      
      // Left edge
      if (drawLeft) {
        paths.push(generateHandDrawnPath(0, h - cornerRadius, 0, cornerRadius, 8));
      }
    }
    
    return paths;
  }, [width, height, borderRadius, sides]);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{ overflow: 'visible' }}
    >
      {paths.map((path, index) => (
        <path
          key={index}
          d={path}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      ))}
    </svg>
  );
}

