import React from 'react';
import { NavLink } from 'react-router-dom';
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
  BookMarked
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

export function Sidebar() {
  return (
    <aside className="w-20 flex flex-col items-center py-4 bg-background-surface dark:bg-dark-background-surface border-r border-background-border dark:border-dark-background-border">
      <nav className="flex flex-col space-y-2 w-full">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center p-3 mx-2 rounded-md transition-colors',
                'text-text-secondary dark:text-dark-text-secondary',
                'hover:bg-accent-primary/10 hover:text-accent-primary dark:hover:text-dark-accent-primary',
                isActive && 'bg-accent-primary/20 text-accent-primary dark:text-dark-accent-primary border-l-2 border-accent-primary'
              )
            }
            title={item.name}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs mt-1 hidden lg:block">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

