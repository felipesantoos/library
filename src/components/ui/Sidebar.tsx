import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Clock, 
  FileText, 
  Target, 
  Calendar, 
  Settings,
  Archive,
  Heart,
  FolderKanban,
  BookMarked,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { HandDrawnCircle } from './HandDrawnCircle';
import { DecorativeArrow } from './DecorativeArrow';
import { HandDrawnBorder } from './HandDrawnBorder';

const navigation = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Library', path: '/library', icon: BookOpen },
  { name: 'Sessions', path: '/sessions', icon: Clock },
  { name: 'Notes', path: '/notes', icon: FileText },
  { name: 'Goals & Stats', path: '/goals', icon: Target },
  { name: 'Journal', path: '/journal', icon: BookMarked },
  { name: 'Collections', path: '/collections', icon: FolderKanban },
  { name: 'Agenda', path: '/agenda', icon: Calendar },
  { name: 'Archive', path: '/archive', icon: Archive },
  { name: 'Wishlist', path: '/wishlist', icon: Heart },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const SIDEBAR_STATE_KEY = 'sidebar-expanded';

export function Sidebar() {
  const location = useLocation();
  const sidebarRef = useRef<HTMLElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_STATE_KEY);
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(isExpanded));
  }, [isExpanded]);

  useEffect(() => {
    const updateDimensions = () => {
      if (sidebarRef.current) {
        const rect = sidebarRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (sidebarRef.current) {
      resizeObserver.observe(sidebarRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [isExpanded]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <aside 
      ref={sidebarRef}
      className={cn(
        'relative flex flex-col bg-background-surface dark:bg-dark-background-surface transition-all duration-300',
        isExpanded ? 'w-64' : 'w-20'
      )}
    >
      {dimensions.width > 0 && dimensions.height > 0 && (
        <HandDrawnBorder
          width={dimensions.width}
          height={dimensions.height}
          borderRadius={0}
          strokeWidth={1}
          sides="right"
          className="pointer-events-none"
        />
      )}
      {/* Logo Section */}
      <div 
        ref={(el) => {
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
              // Update border for this section
            }
          }
        }}
        className={cn(
          'relative h-16 flex items-center transition-all duration-300',
        isExpanded ? 'px-4' : 'px-0 justify-center'
        )}
      >
        <HandDrawnBorder
          width={isExpanded ? 256 : 80}
          height={64}
          borderRadius={0}
          strokeWidth={1}
          sides="bottom"
          className="pointer-events-none"
        />
        {isExpanded ? (
          <div className="flex items-center space-x-3 w-full">
            <div className="w-8 h-8 flex-shrink-0 bg-accent-primary rounded-md flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-background-surface dark:text-dark-text-primary" />
            </div>
            <span className="text-lg font-semibold text-text-primary dark:text-dark-text-primary whitespace-nowrap">
              Library
            </span>
          </div>
        ) : (
          <div className="w-8 h-8 flex-shrink-0 bg-accent-primary rounded-md flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-background-surface dark:text-dark-text-primary" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className={cn(
        'flex flex-col flex-1 overflow-y-auto transition-all duration-300',
        isExpanded ? 'px-2 py-4 space-y-1' : 'py-1 space-y-0'
      )}>
        {navigation.map((item) => {
          const isActive = item.path === '/' 
            ? location.pathname === '/' 
            : location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center rounded-md transition-all duration-200 ease-in-out relative',
                'text-text-secondary dark:text-dark-text-secondary',
                'hover:bg-accent-primary/15 hover:text-accent-primary dark:hover:text-dark-accent-primary',
                'hover:scale-[1.02] active:scale-[0.98]',
                isExpanded 
                  ? 'px-3 py-2.5 space-x-3' 
                  : 'flex-col justify-center p-1 mx-2',
                // Expanded version: more visible active state
                isExpanded && isActive && 'bg-accent-primary/25 text-accent-primary dark:text-dark-accent-primary font-semibold',
                // Collapsed version: subtle background
                !isExpanded && isActive && 'text-accent-primary dark:text-dark-accent-primary'
              )}
              title={!isExpanded ? item.name : undefined}
            >
              {isExpanded ? (
                <>
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium whitespace-nowrap">
                    {item.name}
                  </span>
                  {isActive && (
                    <DecorativeArrow size={40} stroke="currentColor" strokeWidth={50} className="text-accent-primary dark:text-dark-accent-primary" />
                  )}
                </>
              ) : (
                <div className="relative flex flex-col items-center justify-center w-full">
                  <div className="relative flex items-center justify-center w-12 h-12">
                  {isActive && (
                      <HandDrawnCircle 
                        key={`circle-${item.path}-${location.pathname}`}
                        size={60} 
                        strokeWidth={1.5}
                        animate={true}
                        className="text-accent-primary dark:text-dark-accent-primary" 
                      />
                  )}
                    <item.icon className="w-6 h-6 flex-shrink-0 relative z-10" />
                  </div>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Toggle Button */}
      <div className={cn(
        'relative transition-all duration-300',
        isExpanded ? 'px-4 py-3' : 'px-0 py-3 flex justify-center'
      )}>
        <HandDrawnBorder
          width={isExpanded ? 256 : 80}
          height={60}
          borderRadius={0}
          strokeWidth={1}
          sides="top"
          className="pointer-events-none"
        />
        <button
          onClick={toggleSidebar}
          className={cn(
            'flex items-center justify-center rounded-md transition-all duration-200 ease-in-out',
            'text-text-secondary dark:text-dark-text-secondary',
            'hover:bg-accent-primary/15 hover:text-accent-primary dark:hover:text-dark-accent-primary',
            'hover:scale-[1.02] active:scale-[0.98]',
            isExpanded ? 'w-full px-3 py-2 space-x-3' : 'p-2'
          )}
          title={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isExpanded ? (
            <>
              <ChevronLeft className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium whitespace-nowrap">Collapse</span>
            </>
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>
    </aside>
  );
}

