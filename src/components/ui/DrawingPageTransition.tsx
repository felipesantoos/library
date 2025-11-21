import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface DrawingPageTransitionProps {
  children: React.ReactNode;
}

export function DrawingPageTransition({ children }: DrawingPageTransitionProps) {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);
  const [nextChildren, setNextChildren] = useState<React.ReactNode>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const prevLocationRef = useRef(location.pathname);
  const isFirstRender = useRef(true);
  const animationFrameRef = useRef<number>();

  // Effect to detect route changes
  useEffect(() => {
    const currentLocation = location.pathname;
    const prevLocation = prevLocationRef.current;
    
    // Skip animation on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setDisplayChildren(children);
      prevLocationRef.current = currentLocation;
      return;
    }
    
    // Only animate if the location actually changed
    if (prevLocation !== currentLocation) {
      // Start transition immediately
      setIsTransitioning(true);
      setNextChildren(children);
      setAnimationProgress(0);
      
      // Animate the reveal
      const startTime = Date.now();
      const duration = 800; // Animation duration in ms
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease-out curve
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        setAnimationProgress(easedProgress);
        
        if (progress < 1) {
          animationFrameRef.current = requestAnimationFrame(animate);
        } else {
          // Animation complete - update displayChildren first
          setDisplayChildren(children);
          // Wait a frame before cleaning up to ensure smooth transition
          requestAnimationFrame(() => {
            setIsTransitioning(false);
            setNextChildren(null);
            setAnimationProgress(0);
            prevLocationRef.current = currentLocation;
          });
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    } else {
      // If same route, just update children without animation
      setDisplayChildren(children);
    }
  }, [location.pathname, children]);

  return (
    <div 
      className="relative w-full"
      style={{ 
        minHeight: '100%',
      }}
    >
      {/* Current page - only show when not transitioning */}
      {!isTransitioning && (
        <div
          style={{
            position: 'relative',
            width: '100%',
            minHeight: '100%',
          }}
        >
          {displayChildren}
        </div>
      )}
      
      {/* Next page - reveals with drawing animation */}
      {isTransitioning && nextChildren && (
        <div
          className="absolute inset-0"
          style={{
            width: '100%',
            minHeight: '100%',
            clipPath: animationProgress >= 1 
              ? 'none' // Remove clip-path when animation completes
              : `polygon(
                  0% 0%,
                  ${animationProgress * 100}% 0%,
                  ${animationProgress * 100}% 100%,
                  0% 100%
                )`,
            WebkitClipPath: animationProgress >= 1
              ? 'none'
              : `polygon(
                  0% 0%,
                  ${animationProgress * 100}% 0%,
                  ${animationProgress * 100}% 100%,
                  0% 100%
                )`,
            transition: animationProgress >= 1 ? 'clip-path 0.1s ease-out' : 'none',
          }}
        >
          <DrawingRevealMask progress={animationProgress}>
            {nextChildren}
          </DrawingRevealMask>
        </div>
      )}
    </div>
  );
}

// Component that applies drawing animation to all children
function DrawingRevealMask({
  children,
  progress,
}: {
  children: React.ReactNode;
  progress: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousProgressRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // If animation is complete, reset all styles to avoid flash
    if (progress >= 1) {
      const allElements = containerRef.current.querySelectorAll('*');
      allElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        htmlElement.style.opacity = '';
        htmlElement.style.transform = '';
        htmlElement.style.transition = '';
      });
      previousProgressRef.current = 1;
      return;
    }

    // Get all visible elements (excluding script, style, etc.)
    const allElements = containerRef.current.querySelectorAll('*:not(script):not(style):not(svg):not(path)');
    
    allElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      
      // Skip if element is not visible or is a container
      if (htmlElement.offsetWidth === 0 && htmlElement.offsetHeight === 0) return;
      
      // Calculate delay based on position (left to right, top to bottom)
      const rect = htmlElement.getBoundingClientRect();
      const containerRect = containerRef.current!.getBoundingClientRect();
      
      if (containerRect.width === 0) return;
      
      const relativeX = (rect.left - containerRect.left) / containerRect.width;
      const relativeY = (rect.top - containerRect.top) / containerRect.height;
      
      // Elements appear based on their position with a wave effect
      // Start revealing when progress reaches their X position
      const startProgress = relativeX * 0.6 + relativeY * 0.2;
      const revealDuration = 0.3; // How long it takes for each element to fully appear
      const elementProgress = Math.max(0, Math.min(1, (progress - startProgress) / revealDuration));
      
      // Apply opacity with easing
      const easedProgress = elementProgress < 1 
        ? 1 - Math.pow(1 - elementProgress, 3) // Ease-out
        : 1;
      
      htmlElement.style.opacity = String(easedProgress);
      htmlElement.style.transform = `translateY(${(1 - easedProgress) * 10}px)`;
      htmlElement.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
    });
    
    previousProgressRef.current = progress;
  }, [progress]);

  return (
    <div ref={containerRef} style={{ width: '100%', minHeight: '100%' }}>
      {children}
    </div>
  );
}

// Component to draw the page border progressively using a hand-drawn style
function HandDrawnPageBorder({
  width,
  height,
  animate,
}: {
  width: number;
  height: number;
  animate: boolean;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
      if (animate && length > 0) {
        setShouldAnimate(true);
      }
    }
  }, [animate, width, height]);

  // Reset animation when animate prop changes
  useEffect(() => {
    if (animate) {
      setShouldAnimate(false);
      const timer = setTimeout(() => {
        setShouldAnimate(true);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [animate]);

  // Generate a single continuous hand-drawn rectangle path
  const borderPath = useMemo(() => {
    const seed = (width * 73856093) ^ (height * 19349663);
    const variation1 = ((seed % 100) / 50) * 2;
    const variation2 = (((seed * 7) % 100) / 50) * 1.5;
    const variation3 = (((seed * 13) % 100) / 50) * 2.5;
    const variation4 = (((seed * 19) % 100) / 50) * 1.8;
    
    // Create a continuous path starting from top-left, going clockwise
    // Top edge
    const topStartX = 5 + variation1;
    const topEndX = width - 5 - variation1;
    const topMidX = width / 2;
    const topY = 5 - variation1;
    
    // Right edge
    const rightX = width - 5 + variation2;
    const rightStartY = 5;
    const rightEndY = height - 5;
    const rightMidY = height / 2;
    
    // Bottom edge
    const bottomStartX = width - 5;
    const bottomEndX = 5;
    const bottomMidX = width / 2;
    const bottomY = height - 5 + variation3;
    
    // Left edge
    const leftX = 5 - variation4;
    const leftStartY = height - 5;
    const leftEndY = 5;
    const leftMidY = height / 2;
    
    return `M ${topStartX},${topY} 
      C ${topMidX - width/4},${topY - variation1} ${topMidX + width/4},${topY - variation1} ${topEndX},${topY}
      L ${rightX},${rightStartY}
      C ${rightX + variation2},${rightMidY - height/4} ${rightX + variation2},${rightMidY + height/4} ${rightX},${rightEndY}
      L ${bottomStartX},${bottomY}
      C ${bottomMidX + width/4},${bottomY + variation3} ${bottomMidX - width/4},${bottomY + variation3} ${bottomEndX},${bottomY}
      L ${leftX},${leftStartY}
      C ${leftX - variation4},${leftMidY + height/4} ${leftX - variation4},${leftMidY - height/4} ${leftX},${leftEndY}
      Z`;
  }, [width, height]);

  const length = pathLength || (width + height) * 2;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 pointer-events-none z-50"
      style={{ overflow: 'visible' }}
    >
      <style>
        {`
          @keyframes drawBorder {
            from {
              stroke-dashoffset: ${length};
            }
            to {
              stroke-dashoffset: 0;
            }
          }
          .drawing-border {
            stroke-dasharray: ${length};
            stroke-dashoffset: ${length};
            animation: drawBorder 0.6s ease-out forwards;
          }
        `}
      </style>
      <path
        ref={pathRef}
        d={borderPath}
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        className={shouldAnimate ? 'drawing-border' : ''}
        style={{
          color: 'var(--accent-primary, #3b82f6)',
        }}
      />
    </svg>
  );
}

