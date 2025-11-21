import { useMemo } from 'react';
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
// Divides the line into multiple segments for more organic curves
// exactStart and exactEnd are optional - if provided, ensures exact connection
function generateHandDrawnPath(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  seed: number,
  exactStart?: { x: number; y: number },
  exactEnd?: { x: number; y: number }
): string {
  // Use exact points if provided
  const actualStartX = exactStart ? exactStart.x : startX;
  const actualStartY = exactStart ? exactStart.y : startY;
  const actualEndX = exactEnd ? exactEnd.x : endX;
  const actualEndY = exactEnd ? exactEnd.y : endY;
  
  const length = Math.sqrt((actualEndX - actualStartX) ** 2 + (actualEndY - actualStartY) ** 2);
  // Divide into segments - more segments for longer lines
  // Vary segment count slightly based on seed for more randomness
  const baseSegmentSize = 25 + ((seed * 7) % 10); // 25-35 pixels per segment
  const numSegments = Math.max(2, Math.floor(length / baseSegmentSize));
  
  const dx = (actualEndX - actualStartX) / numSegments;
  const dy = (actualEndY - actualStartY) / numSegments;
  
  // Normal vector for perpendicular variations
  // Calculate which side of the box this edge is on to determine correct direction
  // The perpendicular vector should ALWAYS point OUTSIDE the box
  // For top edge (y ≈ 0): should point up (negative Y) = outside
  // For bottom edge (y ≈ height): should point down (positive Y) = outside  
  // For left edge (x ≈ 0): should point left (negative X) = outside
  // For right edge (x ≈ width): should point right (positive X) = outside
  
  // Calculate base perpendicular vector (this points to the right of the direction vector)
  let perpX = length > 0 ? -(actualEndY - actualStartY) / length : 0;
  let perpY = length > 0 ? (actualEndX - actualStartX) / length : 0;
  
  // Determine if this is a horizontal or vertical edge
  const isHorizontal = Math.abs(actualEndY - actualStartY) < Math.abs(actualEndX - actualStartX);
  
  // For horizontal edges (top/bottom): ensure perpY points in correct direction
  // For vertical edges (left/right): ensure perpX points in correct direction
  // Use the same logic for both to ensure consistent behavior
  if (isHorizontal) {
    const avgY = (actualStartY + actualEndY) / 2;
    // Top edge (y small): need negative perpY (upward/outside)
    // Bottom edge (y large): need positive perpY (downward/outside)
    // Default perpY is positive (downward), so:
    // - For top edge: invert to get negative (upward)
    // - For bottom edge: keep positive (downward)
    if (avgY < 10) {
      // Top edge - invert so positive variations go upward (outside)
      perpY = -perpY;
    }
    // Bottom edge: perpY already points downward (outside), no change needed
  } else {
    const avgX = (actualStartX + actualEndX) / 2;
    // Left edge (x small): need negative perpX (leftward/outside)
    // Right edge (x large): need positive perpX (rightward/outside)
    // Default perpX is positive (rightward), so:
    // - For left edge: invert to get negative (leftward)
    // - For right edge: keep positive (rightward)
    if (avgX < 10) {
      // Left edge - invert so positive variations go leftward (outside)
      perpX = -perpX;
    }
    // Right edge: perpX already points rightward (outside), no change needed
  }
  
  // Base variation amplitude - varies per component for more randomness
  const baseAmplitude = 1.2 + ((seed * 13) % 8) * 0.15; // 1.2 to 2.4
  
  let path = `M ${actualStartX} ${actualStartY}`;
  let currentX = actualStartX;
  let currentY = actualStartY;
  
  // Track if we're using exact points (only at start/end)
  const useExactPoints = exactStart && exactEnd;
  
  for (let i = 1; i <= numSegments; i++) {
    // Create unique hash for each segment with more variation
    const segmentHash = ((seed + i * 31 + actualStartX * 7 + actualStartY * 11) * 2654435761) % 1000 / 1000;
    const segmentHash2 = ((seed + i * 47 + actualStartX * 13 + actualStartY * 17) * 2246822507) % 1000 / 1000;
    const segmentHash3 = ((seed + i * 61 + actualStartX * 19 + actualStartY * 23) * 3266489917) % 1000 / 1000;
    const segmentHash4 = ((seed + i * 73 + actualStartX * 29 + actualStartY * 31) * 668265263) % 1000 / 1000;
    
    // Generate more varied and random variations for this segment
    // Use symmetric range to ensure variations go both inside and outside
    // Range: -1.0 to +1.0 (fully symmetric, no bias)
    const variation1 = (segmentHash - 0.5) * 2.0 * baseAmplitude; // -baseAmplitude to +baseAmplitude
    const variation2 = (segmentHash2 - 0.5) * 2.0 * baseAmplitude * 0.9;
    const variation3 = (segmentHash3 - 0.5) * 2.0 * baseAmplitude * 1.1;
    const variation4 = (segmentHash4 - 0.5) * 2.0 * baseAmplitude * 0.85;
    
    // Target point for this segment
    const targetX = actualStartX + dx * i;
    const targetY = actualStartY + dy * i;
    
    // Add perpendicular variations for organic wobble
    // perpX and perpY are now guaranteed to point OUTSIDE
    // Positive variation = outside, negative = inside
    const perpVariation1 = variation1 * perpX;
    const perpVariation2 = variation2 * perpY;
    const perpVariation3 = variation3 * perpX;
    const perpVariation4 = variation4 * perpY;
    
    // Vary control point positions for more randomness
    const cp1Ratio = 0.25 + (segmentHash - 0.5) * 0.15; // 0.175 to 0.325
    const cp2Ratio = 0.65 + (segmentHash2 - 0.5) * 0.15; // 0.575 to 0.725
    
    // Control points with more varied curves
    const cp1X = currentX + dx * cp1Ratio + perpVariation1;
    const cp1Y = currentY + dy * cp1Ratio + perpVariation2;
    const cp2X = currentX + dx * cp2Ratio + perpVariation3;
    const cp2Y = currentY + dy * cp2Ratio + perpVariation4;
    
    // For edges (first and last segments), allow expansion outside
    // For middle segments, keep normal variation
    const isEdgeSegment = i === 1 || i === numSegments;
    const edgeAmplitude = isEdgeSegment ? 3.0 : 1.0; // Much larger variation at edges
    
    // Final point with variation
    let finalX: number;
    let finalY: number;
    
    if (useExactPoints && i === numSegments) {
      // At the very end, use exact point for connection
      finalX = actualEndX;
      finalY = actualEndY;
    } else {
      // Apply variation - larger at edges to allow expansion outside
      const finalVariation = 0.4 + (segmentHash3 - 0.5) * 0.2; // 0.3 to 0.5
      const edgeVariation = isEdgeSegment ? variation4 * edgeAmplitude : variation4;
      finalX = targetX + edgeVariation * perpX * finalVariation;
      finalY = targetY + (isEdgeSegment ? variation1 * edgeAmplitude : variation1) * perpY * finalVariation;
    }
    
    path += ` C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${finalX} ${finalY}`;
    
    currentX = finalX;
    currentY = finalY;
  }
  
  return path;
}

// Generate rounded corner path with random variations
// Each corner gets a unique seed based on position and component dimensions
function generateRoundedCorner(
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  seed: number,
  startPoint?: { x: number; y: number },
  endPoint?: { x: number; y: number }
): string {
  // Calculate angle difference
  let angleDiff = endAngle - startAngle;
  // Normalize angle difference to be in [-π, π]
  if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
  if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
  
  const arcLength = Math.abs(angleDiff) * radius;
  // More segments for smoother transitions
  const numSegments = Math.max(3, Math.floor(arcLength / 12));
  const angleStep = angleDiff / numSegments;
  
  // Create a more complex hash from seed for better randomization
  const hash1 = ((seed * 2654435761) % 1000) / 1000; // Better hash function
  const hash3 = ((seed * 3266489917) % 1000) / 1000;
  
  // Random variations based on seed - each component will have different corners
  // Use MUCH larger variation range to ensure corners can expand outside
  // Base variation: -30% to +50% of radius (strongly biased to allow expansion outside)
  // This ensures corners can definitely expand beyond the original radius
  const baseVariation = (hash1 - 0.3) * radius * 0.8; // -24% to +56% (biased outward)
  const adjustedRadius = radius + baseVariation;
  
  let path = '';
  let currentAngle = startAngle;
  let prevX = 0;
  let prevY = 0;
  
  // Use exact start/end points if provided, but allow variation near them
  const useExactPoints = startPoint && endPoint;
  
  for (let i = 0; i <= numSegments; i++) {
    // Create unique seed for each segment with more variation
    const segmentHash = ((seed + i * 31 + centerX * 7 + centerY * 11) * 2654435761) % 1000 / 1000;
    const segmentHash2 = ((seed + i * 47 + centerX * 13 + centerY * 17) * 2246822507) % 1000 / 1000;
    const t = i / numSegments;
    
    let x: number;
    let y: number;
    
    // Calculate radius and angle variations for all points
    // Use symmetric variations to allow expansion both inside and outside
    const radiusVariation1 = (segmentHash - 0.5) * radius * 0.5; // -25% to +25% (symmetric)
    const radiusVariation2 = i < numSegments ? ((segmentHash2 - 0.5) * radius * 0.5) : radiusVariation1;
    const radiusVariation = radiusVariation1 * (1 - t) + radiusVariation2 * t;
    const currentRadius = adjustedRadius + radiusVariation;
    
    // Allow significant expansion outside - up to 2x the radius
    const minRadius = radius * 0.4; // Can go 60% smaller (inside)
    const maxRadius = radius * 2.0; // Can go 100% larger (outside)
    const clampedRadius = Math.max(minRadius, Math.min(maxRadius, currentRadius));
    
    // Random angle variation
    const angleBase = (hash3 - 0.5) * 0.12;
    const angleVariation1 = angleBase + (segmentHash - 0.5) * 0.1;
    const angleVariation2 = i < numSegments ? (angleBase + (segmentHash2 - 0.5) * 0.1) : angleVariation1;
    const angleVariation = angleVariation1 * (1 - t) + angleVariation2 * t;
    const currentAngleWithVariation = currentAngle + angleVariation;
    
    // Calculate point position
    x = centerX + clampedRadius * Math.cos(currentAngleWithVariation);
    y = centerY + clampedRadius * Math.sin(currentAngleWithVariation);
    
    // Always use exact points at start/end for proper connection
    // But allow intermediate points to expand outside
    if (useExactPoints && i === 0) {
      x = startPoint.x;
      y = startPoint.y;
    } else if (useExactPoints && i === numSegments) {
      x = endPoint.x;
      y = endPoint.y;
    }
    
    if (i === 0) {
      path = `M ${x} ${y}`;
      prevX = x;
      prevY = y;
    } else {
      // Use cubic curves for smooth transitions
      const cp1X = prevX + (x - prevX) * 0.3;
      const cp1Y = prevY + (y - prevY) * 0.3;
      const cp2X = prevX + (x - prevX) * 0.7;
      const cp2Y = prevY + (y - prevY) * 0.7;
      
      path += ` C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${x} ${y}`;
      
      prevX = x;
      prevY = y;
    }
    
    currentAngle += angleStep;
  }
  
  return path;
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
  // Generate a unique seed for this component based on dimensions and position
  // This ensures each component has different random variations
  // Add more factors for better uniqueness
  const componentSeed = useMemo(() => {
    // Use a combination of dimensions, borderRadius, and a hash of the component
    // Add some pseudo-randomness based on the values themselves
    const hash = (width * 73856093) ^ (height * 19349663) ^ ((borderRadius || 0) * 83492791);
    return Math.abs(hash) % 1000000;
  }, [width, height, borderRadius]);

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
    
    // Draw individual sides
    {
      // Draw individual sides
      if (r === 0) {
        // No rounded corners - simple straight lines with imperfections
        if (drawTop) {
          paths.push(generateHandDrawnPath(0, 0, w, 0, componentSeed + 1));
        }
        if (drawRight) {
          paths.push(generateHandDrawnPath(w, 0, w, h, componentSeed + 2));
        }
        if (drawBottom) {
          paths.push(generateHandDrawnPath(w, h, 0, h, componentSeed + 3));
        }
        if (drawLeft) {
          paths.push(generateHandDrawnPath(0, h, 0, 0, componentSeed + 4));
        }
      } else {
        // With rounded corners - each corner gets unique random variations
        const cornerRadius = Math.min(r, w / 2, h / 2);
        
        // Calculate exact connection points for corners
        const topLeftStart = { x: 0, y: cornerRadius };
        const topLeftEnd = { x: cornerRadius, y: 0 };
        const topRightStart = { x: w - cornerRadius, y: 0 };
        const topRightEnd = { x: w, y: cornerRadius };
        const bottomRightStart = { x: w, y: h - cornerRadius };
        const bottomRightEnd = { x: w - cornerRadius, y: h };
        const bottomLeftStart = { x: cornerRadius, y: h };
        const bottomLeftEnd = { x: 0, y: h - cornerRadius };
        
        // Top-left corner - unique seed for this corner
        if (drawTop && drawLeft) {
          paths.push(generateRoundedCorner(cornerRadius, cornerRadius, cornerRadius, Math.PI, Math.PI / 2, componentSeed + 10, topLeftStart, topLeftEnd));
        } else if (drawTop) {
          paths.push(generateHandDrawnPath(0, 0, cornerRadius, 0, componentSeed + 1));
        } else if (drawLeft) {
          paths.push(generateHandDrawnPath(0, cornerRadius, 0, 0, componentSeed + 4));
        }
        
        // Top edge - ensure it connects to corners
        if (drawTop) {
          paths.push(generateHandDrawnPath(
            cornerRadius, 0, 
            w - cornerRadius, 0, 
            componentSeed + 2,
            topLeftEnd,  // exact start
            topRightStart  // exact end
          ));
        }
        
        // Top-right corner - unique seed
        if (drawTop && drawRight) {
          paths.push(generateRoundedCorner(w - cornerRadius, cornerRadius, cornerRadius, Math.PI / 2, 0, componentSeed + 20, topRightStart, topRightEnd));
        } else if (drawTop) {
          paths.push(generateHandDrawnPath(w - cornerRadius, 0, w, 0, componentSeed + 1));
        } else if (drawRight) {
          paths.push(generateHandDrawnPath(w, cornerRadius, w, 0, componentSeed + 2));
        }
        
        // Right edge
        if (drawRight) {
          paths.push(generateHandDrawnPath(
            w, cornerRadius, 
            w, h - cornerRadius, 
            componentSeed + 3,
            topRightEnd,  // exact start
            bottomRightStart  // exact end
          ));
        }
        
        // Bottom-right corner - unique seed
        if (drawRight && drawBottom) {
          paths.push(generateRoundedCorner(w - cornerRadius, h - cornerRadius, cornerRadius, 0, -Math.PI / 2, componentSeed + 30, bottomRightStart, bottomRightEnd));
        } else if (drawRight) {
          paths.push(generateHandDrawnPath(w, h - cornerRadius, w, h, componentSeed + 3));
        } else if (drawBottom) {
          paths.push(generateHandDrawnPath(w - cornerRadius, h, w, h, componentSeed + 3));
        }
        
        // Bottom edge
        if (drawBottom) {
          paths.push(generateHandDrawnPath(
            w - cornerRadius, h, 
            cornerRadius, h, 
            componentSeed + 4,
            bottomRightEnd,  // exact start
            bottomLeftStart  // exact end
          ));
        }
        
        // Bottom-left corner - unique seed
        if (drawBottom && drawLeft) {
          paths.push(generateRoundedCorner(cornerRadius, h - cornerRadius, cornerRadius, -Math.PI / 2, Math.PI, componentSeed + 40, bottomLeftStart, bottomLeftEnd));
        } else if (drawBottom) {
          paths.push(generateHandDrawnPath(cornerRadius, h, 0, h, componentSeed + 3));
        } else if (drawLeft) {
          paths.push(generateHandDrawnPath(0, h - cornerRadius, 0, h, componentSeed + 4));
        }
        
        // Left edge
        if (drawLeft) {
          paths.push(generateHandDrawnPath(
            0, h - cornerRadius, 
            0, cornerRadius, 
            componentSeed + 5,
            bottomLeftEnd,  // exact start
            topLeftStart  // exact end
          ));
        }
      }
    }
    
    return paths;
  }, [width, height, borderRadius, sides, componentSeed]);

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

