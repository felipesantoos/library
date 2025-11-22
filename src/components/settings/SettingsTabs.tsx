import { Palette, Settings, Bell, Database, Keyboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SettingsTab } from './types';

interface SettingsTabsProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export function SettingsTabs({ activeTab, onTabChange }: SettingsTabsProps) {
  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4" /> },
    { id: 'behavior', label: 'Behavior', icon: <Settings className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'data', label: 'Data', icon: <Database className="w-4 h-4" /> },
    { id: 'shortcuts', label: 'Shortcuts', icon: <Keyboard className="w-4 h-4" /> },
  ];

  return (
    <div className="flex items-center space-x-1 border-b border-background-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            'px-4 py-2 font-medium text-sm transition-colors',
            activeTab === tab.id
              ? 'text-accent-primary border-b-2 border-accent-primary'
              : 'text-text-secondary hover:text-text-primary'
          )}
        >
          <div className="flex items-center space-x-2">
            {tab.icon}
            <span>{tab.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

