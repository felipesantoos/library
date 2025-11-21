import React, { useState } from 'react';
import { Search, Plus, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function TopBar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-background-surface dark:bg-dark-background-surface border-b border-background-border dark:border-dark-background-border">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary dark:text-dark-text-secondary" />
          <input
            type="text"
            placeholder="Search for books, notes…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md bg-background dark:bg-dark-background border border-background-border dark:border-dark-background-border text-text-primary dark:text-dark-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3 ml-4">
        <button
          onClick={() => navigate('/session/new')}
          className="flex items-center space-x-2 px-4 py-2 rounded-md bg-accent-primary text-white hover:bg-accent-primary/90 transition-colors"
          title="Start a new reading session"
        >
          <Play className="w-4 h-4" />
          <span className="hidden sm:inline">Start Session</span>
        </button>
        <button
          onClick={() => navigate('/book/new')}
          className="flex items-center space-x-2 px-4 py-2 rounded-md bg-accent-primary text-white hover:bg-accent-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Book</span>
        </button>
      </div>

      {/* Today's Progress Indicator (placeholder) */}
      <div className="hidden lg:flex items-center space-x-4 ml-6 text-sm text-text-secondary dark:text-dark-text-secondary">
        <span>Today: 0 pages</span>
      </div>
    </header>
  );
}

