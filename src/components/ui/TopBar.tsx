import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HandDrawnBorder } from '@/components/ui/HandDrawnBorder';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { Button } from '@/components/ui/Button';

export function TopBar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const headerRef = useRef<HTMLElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (headerRef.current) {
        setWidth(headerRef.current.getBoundingClientRect().width);
      }
    };

    updateWidth();
    
    const resizeObserver = new ResizeObserver(updateWidth);
    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <header 
      ref={headerRef}
      className="relative h-16 flex items-center justify-between px-6 bg-background-surface dark:bg-dark-background-surface"
    >
      {width > 0 && (
        <HandDrawnBorder
          width={width}
          height={64}
          borderRadius={0}
          strokeWidth={1}
          sides="bottom"
          className="pointer-events-none"
        />
      )}
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary dark:text-dark-text-secondary z-10" />
          <HandDrawnBox
            borderRadius={6}
            strokeWidth={1}
            className="w-full"
          >
          <input
            type="text"
            placeholder="Search for books, notes…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md bg-background dark:bg-dark-background text-text-primary dark:text-dark-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary"
          />
          </HandDrawnBox>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3 ml-4">
        <Button
          onClick={() => navigate('/session/new')}
          variant="primary"
          showBorder={false}
          title="Start a new reading session"
          className="flex items-center space-x-2"
        >
          <Play className="w-4 h-4" />
          <span className="hidden sm:inline">Start Session</span>
        </Button>
        <Button
          onClick={() => navigate('/book/new')}
          variant="primary"
          showBorder={false}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Book</span>
        </Button>
      </div>

      {/* Today's Progress Indicator (placeholder) */}
      <div className="hidden lg:flex items-center space-x-4 ml-6 text-sm text-text-secondary dark:text-dark-text-secondary">
        <span>Today: 0 pages</span>
      </div>
    </header>
  );
}

