import { Section, Stack } from '@/components/ui/layout';
import { Heading } from '@/components/ui/typography';
import { TrendingUp } from 'lucide-react';
import { useMemo, useRef, useEffect, useState } from 'react';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';

interface ProgressDataPoint {
  date: string;
  progress: number;
  cumulative?: number; // Page number reached at this point
}

interface ProgressChartProps {
  data: ProgressDataPoint[];
  totalPages?: number; // Total pages of the book
}

// Generate hand-drawn path with organic imperfections for chart lines
function generateHandDrawnLinePath(
  points: Array<{ x: number; y: number }>,
  seed: number = 0
): string {
  if (points.length === 0) return '';
  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  let path = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    
    const length = Math.sqrt((curr.x - prev.x) ** 2 + (curr.y - prev.y) ** 2);
    const baseSegmentSize = 20 + ((seed + i * 7) % 8); // 20-28 pixels per segment
    const numSegments = Math.max(2, Math.floor(length / baseSegmentSize));
    
    const dx = (curr.x - prev.x) / numSegments;
    const dy = (curr.y - prev.y) / numSegments;
    
    // Perpendicular vector for wobble
    const perpX = length > 0 ? -(curr.y - prev.y) / length : 0;
    const perpY = length > 0 ? (curr.x - prev.x) / length : 0;
    
    const baseAmplitude = 1.5; // Smaller amplitude for chart lines
    
    let currentX = prev.x;
    let currentY = prev.y;
    
    for (let j = 1; j <= numSegments; j++) {
      const segmentHash = ((seed + i * 31 + j * 17) * 2654435761) % 1000;
      const segmentHash2 = ((seed + i * 47 + j * 23) * 2246822507) % 1000 / 1000;
      
      const variation1 = (segmentHash / 1000 - 0.5) * 2.0 * baseAmplitude;
      const variation2 = (segmentHash2 - 0.5) * 2.0 * baseAmplitude * 0.8;
      
      const perpVariation1 = variation1 * perpX;
      const perpVariation2 = variation2 * perpY;
      
      const cp1Ratio = 0.3 + (segmentHash / 1000 - 0.5) * 0.1;
      const cp2Ratio = 0.7 + (segmentHash2 - 0.5) * 0.1;
      
      const cp1X = currentX + dx * cp1Ratio + perpVariation1 * 0.5;
      const cp1Y = currentY + dy * cp1Ratio + perpVariation2 * 0.5;
      
      const cp2X = currentX + dx * cp2Ratio + perpVariation1 * 0.7;
      const cp2Y = currentY + dy * cp2Ratio + perpVariation2 * 0.7;
      
      const finalX = j === numSegments ? curr.x : currentX + dx + perpVariation1 * 0.3;
      const finalY = j === numSegments ? curr.y : currentY + dy + perpVariation2 * 0.3;
      
      path += ` C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${finalX} ${finalY}`;
      
      currentX = finalX;
      currentY = finalY;
    }
  }
  
  return path;
}

export function ProgressChart({ data, totalPages }: ProgressChartProps) {
  if (data.length === 0) return null;

  const containerRef = useRef<HTMLDivElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(400);
  const [hoveredPoint, setHoveredPoint] = useState<{ index: number; x: number; y: number; progress: number; pages?: number } | null>(null);
  const [isDark, setIsDark] = useState(false);

  // Detect dark mode for popover background
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  // Measure container width on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      if (svgContainerRef.current) {
        // Get the actual width of the SVG container
        const width = svgContainerRef.current.offsetWidth;
        setContainerWidth(Math.max(400, width));
      }
    };

    updateWidth();
    
    // Use ResizeObserver for more accurate measurements
    const resizeObserver = new ResizeObserver(updateWidth);
    if (svgContainerRef.current) {
      resizeObserver.observe(svgContainerRef.current);
    }
    
    // Also listen to window resize as fallback
    window.addEventListener('resize', updateWidth);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // Always show full range 0-100%
  const maxProgress = Math.max(...data.map(d => d.progress), 100);
  const minProgress = Math.min(...data.map(d => d.progress), 0);
  
  const padding = 40;
  const chartWidth = containerWidth;
  const chartHeight = 200;

  // Calculate SVG container height to maintain aspect ratio while using full width
  const svgContainerHeight = useMemo(() => {
    if (containerWidth > 0 && chartWidth > 0) {
      // Calculate height based on width to maintain aspect ratio
      const aspectRatio = (chartHeight + padding) / chartWidth;
      const calculatedHeight = containerWidth * aspectRatio;
      return Math.max(200, Math.min(300, calculatedHeight)); // Min 200px, max 300px
    }
    return 240;
  }, [containerWidth, chartWidth, chartHeight, padding]);

  // Calculate points for the line - progress is already 0-100%, use directly
  const linePoints = useMemo(() => {
    return data.map((d, i) => {
      const x = data.length > 1 
        ? padding + ((chartWidth - padding - 10) / (data.length - 1)) * i
        : padding + (chartWidth - padding - 10) / 2;
      // Y position: 0% = top (y=0), 100% = bottom (y=chartHeight)
      const y = (chartHeight * (100 - d.progress)) / 100;
      return { x, y, progress: d.progress };
    });
  }, [data, padding, chartWidth, chartHeight]);

  // Generate hand-drawn path for the progress line
  const handDrawnPath = useMemo(() => {
    return generateHandDrawnLinePath(linePoints, 42);
  }, [linePoints]);

  return (
    <Section padding="md">
      <Stack spacing="md">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-accent-primary" />
          <Heading level={4}>Progress Over Time</Heading>
        </div>
        <div ref={containerRef} className="relative w-full px-4">
          <div ref={svgContainerRef} className="py-2 w-full" style={{ height: `${svgContainerHeight}px` }}>
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight + padding}`} 
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
              style={{ overflow: 'visible' }}
            >
            {/* Background */}
            <rect
              x="0"
              y="0"
              width={chartWidth}
              height={chartHeight}
              fill="transparent"
            />

            {/* Grid lines and Y-axis labels - Always show 0%, 25%, 50%, 75%, 100% */}
            {[0, 25, 50, 75, 100].map((percent) => {
              const y = (chartHeight * (100 - percent)) / 100;
              return (
                <g key={percent}>
                  <line
                    x1={padding}
                    y1={y}
                    x2={chartWidth - 10}
                    y2={y}
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                    className="text-background-border opacity-40"
                  />
                  <text
                    x={padding - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="text-xs fill-text-secondary font-medium"
                  >
                    {percent}%
                  </text>
                </g>
              );
            })}

            {/* Progress line - hand-drawn style */}
            <g className="text-text-primary">
              {handDrawnPath && (
                <path
                  d={handDrawnPath}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </g>

            {/* Data points - hand-drawn style circles */}
            {linePoints.map((point, i) => {
              const d = data[i];
              // Add slight variation to point positions for hand-drawn effect
              const variationX = ((i * 17 + 23) % 7) - 3; // -3 to +3
              const variationY = ((i * 31 + 41) % 7) - 3; // -3 to +3
              const actualX = point.x + variationX * 0.2;
              const actualY = point.y + variationY * 0.2;
              
              return (
                <g key={i} className="text-text-primary">
                  {/* Outer circle with slight variation - background color */}
                  <circle
                    cx={point.x + variationX * 0.3}
                    cy={point.y + variationY * 0.3}
                    r="6"
                    className="fill-background-surface dark:fill-dark-background-surface"
                    stroke="currentColor"
                    strokeWidth="2"
                    onMouseEnter={(e) => {
                      const svg = e.currentTarget.ownerSVGElement;
                      if (svg && svgContainerRef.current) {
                        const containerRect = svgContainerRef.current.getBoundingClientRect();
                        const pointRect = svg.createSVGPoint();
                        pointRect.x = actualX;
                        pointRect.y = actualY;
                        const screenCTM = svg.getScreenCTM();
                        if (screenCTM) {
                          const screenPoint = pointRect.matrixTransform(screenCTM);
                          setHoveredPoint({
                            index: i,
                            x: screenPoint.x - containerRect.left,
                            y: screenPoint.y - containerRect.top,
                            progress: d.progress,
                            pages: d.cumulative,
                          });
                        }
                      }
                    }}
                    onMouseLeave={() => setHoveredPoint(null)}
                    style={{ cursor: 'pointer' }}
                  />
                  {/* Inner circle - text color */}
                  <circle
                    cx={actualX}
                    cy={actualY}
                    r="4"
                    fill="currentColor"
                    onMouseEnter={(e) => {
                      const svg = e.currentTarget.ownerSVGElement;
                      if (svg && svgContainerRef.current) {
                        const containerRect = svgContainerRef.current.getBoundingClientRect();
                        const pointRect = svg.createSVGPoint();
                        pointRect.x = actualX;
                        pointRect.y = actualY;
                        const screenCTM = svg.getScreenCTM();
                        if (screenCTM) {
                          const screenPoint = pointRect.matrixTransform(screenCTM);
                          setHoveredPoint({
                            index: i,
                            x: screenPoint.x - containerRect.left,
                            y: screenPoint.y - containerRect.top,
                            progress: d.progress,
                            pages: d.cumulative,
                          });
                        }
                      }
                    }}
                    onMouseLeave={() => setHoveredPoint(null)}
                    style={{ cursor: 'pointer' }}
                  />
                  {/* Tooltip on hover */}
                  <title>{`${new Date(d.date).toLocaleDateString()}: ${d.progress.toFixed(1)}%`}</title>
                </g>
              );
            })}

            {/* X-axis line */}
            <line
              x1={padding}
              y1={chartHeight}
              x2={chartWidth - 10}
              y2={chartHeight}
              stroke="currentColor"
              strokeWidth="2"
              className="text-background-border"
            />
            </svg>
            
            {/* Tooltip popover */}
            {hoveredPoint && svgContainerRef.current && (() => {
              const containerWidth = svgContainerRef.current.offsetWidth;
              const popoverWidth = 120; // Estimated popover width
              const halfPopoverWidth = popoverWidth / 2;
              
              // Calculate left position to avoid clipping
              let leftPosition = hoveredPoint.x;
              let transform = 'translateX(-50%)';
              
              // If too close to left edge, align to left
              if (hoveredPoint.x < halfPopoverWidth) {
                leftPosition = halfPopoverWidth;
                transform = 'translateX(0)';
              }
              // If too close to right edge, align to right
              else if (hoveredPoint.x > containerWidth - halfPopoverWidth) {
                leftPosition = containerWidth - halfPopoverWidth;
                transform = 'translateX(0)';
              }
              
              return (
                <div
                  className="absolute pointer-events-none z-10"
                  style={{
                    left: `${leftPosition}px`,
                    top: `${hoveredPoint.y - 70}px`,
                    transform,
                  }}
                >
                  <HandDrawnBox
                    borderRadius={6}
                    strokeWidth={1}
                    linearCorners={true}
                    className="px-3 py-2 shadow-medium whitespace-nowrap"
                    style={{
                      backgroundColor: isDark ? '#27211D' : '#FAF7EF',
                      minWidth: '100px',
                    }}
                  >
                    <div className="text-sm font-medium text-text-primary">
                      {hoveredPoint.progress.toFixed(1)}%
                    </div>
                    {hoveredPoint.pages !== undefined && totalPages && (
                      <div className="text-xs text-text-secondary mt-1">
                        Page {hoveredPoint.pages} of {totalPages}
                      </div>
                    )}
                  </HandDrawnBox>
                </div>
              );
            })()}
          </div>

          {/* X-axis labels */}
          <div className="flex items-center justify-between px-6 text-xs text-text-secondary font-medium">
            {data.length > 0 && (
              <>
                <span>{new Date(data[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                {data.length > 1 && (
                  <span>{new Date(data[data.length - 1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                )}
              </>
            )}
          </div>

          {/* Legend/Info */}
          {data.length > 0 && (
            <div className="px-6 pb-2 text-xs text-text-secondary text-center">
              {data.length} {data.length === 1 ? 'data point' : 'data points'} • Progress: {minProgress.toFixed(1)}% - {maxProgress.toFixed(1)}%
            </div>
          )}
        </div>
      </Stack>
    </Section>
  );
}

