import { Calendar, FileText, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export type BookTab = 'overview' | 'sessions' | 'notes' | 'summary';

interface BookTabsProps {
  activeTab: BookTab;
  onTabChange: (tab: BookTab) => void;
  sessionsCount: number;
  filteredSessionsCount: number;
  notesCount: number;
  selectedReadingId: number | null;
}

export function BookTabs({
  activeTab,
  onTabChange,
  sessionsCount,
  filteredSessionsCount,
  notesCount,
  selectedReadingId,
}: BookTabsProps) {
  return (
    <div className="flex items-center space-x-1 border-b border-background-border">
      <button
        onClick={() => onTabChange('overview')}
        className={cn(
          "px-4 py-2 font-medium text-sm transition-colors rounded-none border-b-2 border-transparent",
          activeTab === 'overview'
            ? 'text-accent-primary border-accent-primary'
            : 'text-text-secondary hover:text-text-primary'
        )}
      >
        Overview
      </button>
      <button
        onClick={() => onTabChange('sessions')}
        className={cn(
          "px-4 py-2 font-medium text-sm transition-colors rounded-none border-b-2 border-transparent flex items-center space-x-2",
          activeTab === 'sessions'
            ? 'text-accent-primary border-accent-primary'
            : 'text-text-secondary hover:text-text-primary'
        )}
      >
        <Calendar className="w-4 h-4" />
        <span>
          Sessions ({filteredSessionsCount}
          {selectedReadingId !== null && sessionsCount > filteredSessionsCount && (
            <span className="text-text-secondary"> / {sessionsCount}</span>
          )})
        </span>
      </button>
      <button
        onClick={() => onTabChange('notes')}
        className={cn(
          "px-4 py-2 font-medium text-sm transition-colors rounded-none border-b-2 border-transparent flex items-center space-x-2",
          activeTab === 'notes'
            ? 'text-accent-primary border-accent-primary'
            : 'text-text-secondary hover:text-text-primary'
        )}
      >
        <FileText className="w-4 h-4" />
        <span>Notes ({notesCount})</span>
      </button>
      <button
        onClick={() => onTabChange('summary')}
        className={cn(
          "px-4 py-2 font-medium text-sm transition-colors rounded-none border-b-2 border-transparent flex items-center space-x-2",
          activeTab === 'summary'
            ? 'text-accent-primary border-accent-primary'
            : 'text-text-secondary hover:text-text-primary'
        )}
      >
        <Sparkles className="w-4 h-4" />
        <span>Summary</span>
      </button>
    </div>
  );
}

