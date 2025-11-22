import { useRef, useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { HandDrawnBorder } from '@/components/ui/HandDrawnBorder';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number; // default 100
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'default' | 'accent' | 'success';
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = 'md',
  className,
  variant = 'default',
}: ProgressBarProps) {
  // Ensure value is a valid number and calculate percentage
  const numericValue = typeof value === 'number' && !isNaN(value) ? value : 0;
  const percentage = Math.min(Math.max((numericValue / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2',
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const outerContainerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [outerWidth, setOuterWidth] = useState(0);
  const [outerHeight, setOuterHeight] = useState(0);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setWidth(rect.width);
        setHeight(rect.height);
      }
      if (outerContainerRef.current) {
        const rect = outerContainerRef.current.getBoundingClientRect();
        setOuterWidth(rect.width);
        setOuterHeight(rect.height);
      }
    };

    // Initial update
    updateDimensions();
    
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      updateDimensions();
    });

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    if (outerContainerRef.current) {
      resizeObserver.observe(outerContainerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [percentage]);

  // Get background color for inline style fallback
  const getBackgroundColor = () => {
    const isDark = document.documentElement.classList.contains('dark');
    switch (variant) {
      case 'default':
        return isDark ? '#6D88C2' : '#000000'; // dark-accent-primary : black
      case 'accent':
        return isDark ? '#D1A95A' : '#B28A4A'; // dark-accent-secondary : accent-secondary
      case 'success':
        return isDark ? '#88A46C' : '#6E8C5E'; // dark-semantic-success : semantic-success
      default:
        return isDark ? '#6D88C2' : '#000000';
    }
  };

  // Get border color - always black
  const getBorderColor = () => {
    return '#000000'; // black
  };

  // Generate unique seed for this progress bar instance
  const seed = useMemo(() => Math.floor(Math.random() * 1000000), []);
  
  // Generate hand-drawn path for progress bar edges
  const generateHandDrawnPath = useMemo(() => {
    if (width === 0 || height === 0) {
      return '';
    }
    
    const localSeed = seed + Math.floor(width * 1000 + height * 100);
    const barWidth = width;
    const numSegments = Math.max(6, Math.floor(barWidth / 15));
    const segmentWidth = barWidth / numSegments;
    const amplitude = Math.max(0.5, height * 0.15); // Variation amplitude for visible effect
    const horizontalAmplitude = Math.max(2, barWidth * 0.08); // Horizontal variation amplitude for side edges
    
    // Create a closed path with irregular curved edges on all sides
    // Start at top-left with some variation
    const leftTopHash = ((localSeed * 17) * 2654435761) % 1000 / 1000;
    const leftTopVariation = (leftTopHash - 0.5) * amplitude;
    const startY = Math.max(0, Math.min(height * 0.3, leftTopVariation));
    let path = `M 0 ${startY}`;
    
    // Top edge with curved variations - using cubic Bezier curves
    for (let i = 1; i <= numSegments; i++) {
      const x = i * segmentWidth;
      const prevX = (i - 1) * segmentWidth;
      
      const hash1 = ((localSeed + i * 31) * 2654435761) % 1000 / 1000;
      const hash2 = ((localSeed + i * 37) * 2246822507) % 1000 / 1000;
      const hash3 = ((localSeed + i * 41) * 3266489917) % 1000 / 1000;
      
      const variation1 = (hash1 - 0.5) * 2 * amplitude;
      const variation2 = (hash2 - 0.5) * 2 * amplitude;
      const variation3 = (hash3 - 0.5) * 2 * amplitude;
      
      const y1 = Math.max(0, Math.min(height * 0.4, variation1));
      const y2 = Math.max(0, Math.min(height * 0.4, variation2));
      const y3 = Math.max(0, Math.min(height * 0.4, variation3));
      
      // Use cubic Bezier curve for smooth organic curves
      const cp1X = prevX + (segmentWidth * 0.3);
      const cp1Y = y1;
      const cp2X = prevX + (segmentWidth * 0.7);
      const cp2Y = y2;
      
      path += ` C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${x} ${y3}`;
    }
    
    // Right edge with curved variations - using cubic Bezier curves
    const rightNumSegments = Math.max(4, Math.floor(height / 6));
    const rightSegmentHeight = height / rightNumSegments;
    
    for (let i = 1; i <= rightNumSegments; i++) {
      const y = i * rightSegmentHeight;
      const prevY = (i - 1) * rightSegmentHeight;
      
      const hash1 = ((localSeed + i * 61) * 2654435761) % 1000 / 1000;
      const hash2 = ((localSeed + i * 67) * 2246822507) % 1000 / 1000;
      const hash3 = ((localSeed + i * 71) * 3266489917) % 1000 / 1000;
      
      // Horizontal variations for right edge
      const variation1 = (hash1 - 0.5) * 2 * horizontalAmplitude;
      const variation2 = (hash2 - 0.5) * 2 * horizontalAmplitude;
      const variation3 = (hash3 - 0.5) * 2 * horizontalAmplitude;
      
      // Allow variations to go both inside and outside the bar
      const x1 = barWidth + variation1;
      const x2 = barWidth + variation2;
      const x3 = barWidth + variation3;
      
      // Use cubic Bezier curve for smooth organic curves
      const cp1X = x1;
      const cp1Y = prevY + (rightSegmentHeight * 0.3);
      const cp2X = x2;
      const cp2Y = prevY + (rightSegmentHeight * 0.7);
      
      path += ` C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${x3} ${y}`;
    }
    
    // Bottom edge with curved variations (going backwards) - using cubic Bezier curves
    for (let i = numSegments - 1; i >= 0; i--) {
      const x = i * segmentWidth;
      const nextX = (i + 1) * segmentWidth;
      
      const hash1 = ((localSeed + i * 47) * 2654435761) % 1000 / 1000;
      const hash2 = ((localSeed + i * 53) * 2246822507) % 1000 / 1000;
      const hash3 = ((localSeed + i * 59) * 3266489917) % 1000 / 1000;
      
      const variation1 = (hash1 - 0.5) * 2 * amplitude;
      const variation2 = (hash2 - 0.5) * 2 * amplitude;
      const variation3 = (hash3 - 0.5) * 2 * amplitude;
      
      const y1 = Math.max(height * 0.6, Math.min(height, height - variation1));
      const y2 = Math.max(height * 0.6, Math.min(height, height - variation2));
      const y3 = Math.max(height * 0.6, Math.min(height, height - variation3));
      
      // Use cubic Bezier curve for smooth organic curves
      const cp1X = nextX - (segmentWidth * 0.3);
      const cp1Y = y1;
      const cp2X = nextX - (segmentWidth * 0.7);
      const cp2Y = y2;
      
      path += ` C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${x} ${y3}`;
    }
    
    // Left edge with curved variations - using cubic Bezier curves
    for (let i = rightNumSegments - 1; i >= 0; i--) {
      const y = i * rightSegmentHeight;
      const nextY = (i + 1) * rightSegmentHeight;
      
      const hash1 = ((localSeed + i * 73) * 2654435761) % 1000 / 1000;
      const hash2 = ((localSeed + i * 79) * 2246822507) % 1000 / 1000;
      const hash3 = ((localSeed + i * 83) * 3266489917) % 1000 / 1000;
      
      // Horizontal variations for left edge
      const variation1 = (hash1 - 0.5) * 2 * horizontalAmplitude;
      const variation2 = (hash2 - 0.5) * 2 * horizontalAmplitude;
      const variation3 = (hash3 - 0.5) * 2 * horizontalAmplitude;
      
      // Allow variations to go both inside and outside the bar
      const x1 = 0 + variation1;
      const x2 = 0 + variation2;
      const x3 = 0 + variation3;
      
      // Use cubic Bezier curve for smooth organic curves
      const cp1X = x1;
      const cp1Y = nextY - (rightSegmentHeight * 0.3);
      const cp2X = x2;
      const cp2Y = nextY - (rightSegmentHeight * 0.7);
      
      path += ` C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${x3} ${y}`;
    }
    
    // Close the path
    path += ` Z`;
    
    return path;
  }, [width, height, percentage, seed]);

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs text-text-secondary dark:text-dark-text-secondary mb-1">
          {label && <span>{label}</span>}
          {showPercentage && (
            <span>{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div
        ref={outerContainerRef}
        className={cn(
          'w-full relative bg-background-surface dark:bg-dark-background-surface',
          sizeClasses[size]
        )}
      >
        {outerWidth > 0 && outerHeight > 0 && (
          <HandDrawnBorder
            width={outerWidth}
            height={outerHeight}
            borderRadius={0}
            strokeWidth={1}
            color={getBorderColor()}
          />
        )}
        <div className="absolute inset-0 overflow-hidden">
        <div
          ref={containerRef}
          className="relative h-full transition-all duration-300"
          style={{ 
            width: `${percentage}%`,
            minWidth: percentage > 0 ? '2px' : '0px',
            overflow: 'hidden',
          }}
        >
          {width > 0 && height > 0 && percentage > 0 && generateHandDrawnPath ? (
            <svg
              width={width}
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              className="absolute inset-0"
              preserveAspectRatio="none"
            >
              <defs>
                <clipPath id={`progress-clip-${seed}`}>
                  <path d={generateHandDrawnPath} />
                </clipPath>
              </defs>
              <rect
                width={width}
                height={height}
                fill={getBackgroundColor()}
                clipPath={`url(#progress-clip-${seed})`}
              />
            </svg>
          ) : (
            <div
              className="h-full"
              style={{ 
                backgroundColor: getBackgroundColor(),
                width: '100%'
              }}
            />
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

