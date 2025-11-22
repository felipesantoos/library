import { useState, useRef, useCallback } from 'react';

export function useHeaderWidth() {
  const [width, setWidth] = useState(0);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const headerRef = useCallback((node: HTMLElement | null) => {
    // Disconnect previous observer
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
    }

    if (node) {
      // Set initial width
      setWidth(node.getBoundingClientRect().width);

      // Create and attach observer
      resizeObserverRef.current = new ResizeObserver(() => {
        setWidth(node.getBoundingClientRect().width);
      });
      resizeObserverRef.current.observe(node);
    }
  }, []);

  return { headerRef, width };
}

