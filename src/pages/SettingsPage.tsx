import { useState, useEffect } from 'react';
import { useTheme } from '@/theme';
import { toast } from '@/utils/toast';
import { Container, Stack, Section } from '@/components/ui/layout';
import { Heading, Paragraph, MetaText } from '@/components/ui/typography';
import { Moon, Sun, Type, Focus, Download, Database, Palette, Keyboard, Contrast, Minimize2, Upload, FileText, Calendar, BookOpen, Settings, Bell, Clock, AlertTriangle } from 'lucide-react';
import { setSetting } from '@/hooks/useSettings';
import { invoke } from '@tauri-apps/api/core';
import { defaultShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useLastBackupDate, registerBackup, validateBackupJson, BackupMetadata } from '@/hooks/useBackup';
import { useBooks } from '@/hooks/useBooks';
import { useSessions } from '@/hooks/useSessions';
import { useNotes } from '@/hooks/useNotes';
import { useSettings } from '@/hooks/useSettings';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { Button } from '@/components/ui/Button';
import { HandDrawnDropdown } from '@/components/ui/inputs';
import { cn } from '@/lib/utils';

export function SettingsPage() {
  const { 
    theme, 
    setTheme, 
    fontSize, 
    setFontSize, 
    highFocusMode, 
    setHighFocusMode,
    lineSpacing,
    setLineSpacing,
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion,
  } = useTheme();
  const [activeTab, setActiveTab] = useState<'appearance' | 'behavior' | 'notifications' | 'data' | 'shortcuts'>('appearance');
  const { settings } = useSettings();
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number | undefined>(undefined);
  const { lastBackupDate, refresh: refreshLastBackup } = useLastBackupDate('full');
  const { books } = useBooks({});
  const { sessions } = useSessions({});
  const { notes } = useNotes({});
  
  // Helper to get setting value from backend or localStorage
  const getSettingValue = (key: string, defaultValue: string): string => {
    const setting = settings.find(s => s.key === key);
    if (setting) {
      localStorage.setItem(key, setting.value); // Sync to localStorage
      return setting.value;
    }
    return localStorage.getItem(key) || defaultValue;
  };

  // Behavior settings
  const [defaultProgressUnit, setDefaultProgressUnit] = useState<'page' | 'percentage'>(() => {
    const value = getSettingValue('defaultProgressUnit', 'page');
    return (value === 'page' || value === 'percentage') ? value : 'page';
  });
  const [autoOpenTimer, setAutoOpenTimer] = useState<boolean>(() => {
    return getSettingValue('autoOpenTimer', 'false') === 'true';
  });
  const [defaultStartPage, setDefaultStartPage] = useState<string>(() => {
    return getSettingValue('defaultStartPage', '1');
  });

  // Notification settings
  const [dailyReminder, setDailyReminder] = useState<boolean>(() => {
    return getSettingValue('dailyReminder', 'false') === 'true';
  });
  const [readingPrompt, setReadingPrompt] = useState<boolean>(() => {
    return getSettingValue('readingPrompt', 'false') === 'true';
  });
  const [goalReminders, setGoalReminders] = useState<boolean>(() => {
    return getSettingValue('goalReminders', 'false') === 'true';
  });

  // Sync settings from backend when they load
  useEffect(() => {
    if (settings.length > 0) {
      const progressUnit = getSettingValue('defaultProgressUnit', 'page');
      if (progressUnit === 'page' || progressUnit === 'percentage') {
        setDefaultProgressUnit(progressUnit);
      }
      setAutoOpenTimer(getSettingValue('autoOpenTimer', 'false') === 'true');
      setDefaultStartPage(getSettingValue('defaultStartPage', '1'));
      setDailyReminder(getSettingValue('dailyReminder', 'false') === 'true');
      setReadingPrompt(getSettingValue('readingPrompt', 'false') === 'true');
      setGoalReminders(getSettingValue('goalReminders', 'false') === 'true');
    }
  }, [settings]);

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    // Persist to backend if needed
    setSetting('theme', newTheme).catch(console.error);
  };

  const handleFontSizeChange = (newSize: 'small' | 'standard' | 'large') => {
    setFontSize(newSize);
    setSetting('fontSize', newSize).catch(console.error);
  };

  const handleHighFocusModeChange = (enabled: boolean) => {
    setHighFocusMode(enabled);
    setSetting('highFocusMode', enabled.toString()).catch(console.error);
  };

  const handleLineSpacingChange = (spacing: 'tight' | 'normal' | 'relaxed' | 'loose') => {
    setLineSpacing(spacing);
    setSetting('lineSpacing', spacing).catch(console.error);
  };

  const handleHighContrastChange = (enabled: boolean) => {
    setHighContrast(enabled);
    setSetting('highContrast', enabled.toString()).catch(console.error);
  };

  const handleReducedMotionChange = (enabled: boolean) => {
    setReducedMotion(enabled);
    setSetting('reducedMotion', enabled.toString()).catch(console.error);
  };

  const handleProgressUnitChange = (unit: 'page' | 'percentage') => {
    setDefaultProgressUnit(unit);
    localStorage.setItem('defaultProgressUnit', unit);
    setSetting('defaultProgressUnit', unit).catch(console.error);
  };

  const handleAutoOpenTimerChange = (enabled: boolean) => {
    setAutoOpenTimer(enabled);
    localStorage.setItem('autoOpenTimer', enabled.toString());
    setSetting('autoOpenTimer', enabled.toString()).catch(console.error);
  };

  const handleDefaultStartPageChange = (page: string) => {
    setDefaultStartPage(page);
    localStorage.setItem('defaultStartPage', page);
    setSetting('defaultStartPage', page).catch(console.error);
  };

  const handleDailyReminderChange = (enabled: boolean) => {
    setDailyReminder(enabled);
    localStorage.setItem('dailyReminder', enabled.toString());
    setSetting('dailyReminder', enabled.toString()).catch(console.error);
  };

  const handleReadingPromptChange = (enabled: boolean) => {
    setReadingPrompt(enabled);
    localStorage.setItem('readingPrompt', enabled.toString());
    setSetting('readingPrompt', enabled.toString()).catch(console.error);
  };

  const handleGoalRemindersChange = (enabled: boolean) => {
    setGoalReminders(enabled);
    localStorage.setItem('goalReminders', enabled.toString());
    setSetting('goalReminders', enabled.toString()).catch(console.error);
  };

  const handleExportData = async () => {
    try {
      setExporting(true);
      
      // Get all data from backend
      const [books, sessions, notes, goals] = await Promise.all([
        invoke<any[]>('list_books'),
        invoke<any[]>('list_sessions'),
        invoke<any[]>('list_notes'),
        invoke<any[]>('list_goals', { include_inactive: true }),
      ]);

      const backupData = {
        version: '1.0',
        exported_at: new Date().toISOString(),
        data: {
          books,
          sessions,
          notes,
          goals,
        },
      };

      // Convert to JSON string
      const jsonString = JSON.stringify(backupData, null, 2);
      
      // Create blob and download
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reading-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Register backup in database
      const fileName = `reading-backup-${new Date().toISOString().split('T')[0]}.json`;
      const metadata: BackupMetadata = {
        backup_type: 'full',
        book_count: books.length,
        session_count: sessions.length,
        note_count: notes.length,
      };
      
      try {
        await registerBackup('', fileName, 'full', metadata);
        await refreshLastBackup();
      } catch (err) {
        console.error('Failed to register backup:', err);
      }

      toast.success('Backup exported successfully!');
    } catch (err) {
      toast.handleError(err, 'Failed to export backup');
      console.error('Export error:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleExportYearStats = async (year: number) => {
    try {
      setExporting(true);
      
      // Get sessions for the year
      const yearSessions = sessions.filter(s => {
        const sessionYear = new Date(s.session_date).getFullYear();
        return sessionYear === year;
      });

      // Get books completed in the year
      const yearBooks = books.filter(b => {
        if (b.status === 'completed' && b.status_changed_at) {
          const completedYear = new Date(b.status_changed_at).getFullYear();
          return completedYear === year;
        }
        return false;
      });

      const backupData = {
        version: '1.0',
        exported_at: new Date().toISOString(),
        type: 'year_stats',
        year,
        data: {
          sessions: yearSessions,
          books_completed: yearBooks,
          statistics: {
            total_sessions: yearSessions.length,
            total_books_completed: yearBooks.length,
            total_pages_read: yearSessions.reduce((sum, s) => sum + (s.pages_read || 0), 0),
            total_minutes_read: yearSessions.reduce((sum, s) => sum + (s.minutes_read || 0), 0),
          },
        },
      };

      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reading-year-stats-${year}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Register backup
      const metadata: BackupMetadata = {
        backup_type: 'year_stats',
        year,
        session_count: yearSessions.length,
        book_count: yearBooks.length,
      };
      
      try {
        await registerBackup('', link.download, 'year_stats', metadata);
      } catch (err) {
        console.error('Failed to register backup:', err);
      }

      alert(`Year ${year} statistics exported successfully!`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to export year statistics');
      console.error('Export error:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleExportSingleBook = async (bookId: number) => {
    try {
      setExporting(true);
      
      const book = books.find(b => b.id === bookId);
      if (!book) {
        alert('Book not found');
        return;
      }

      const bookSessions = sessions.filter(s => s.book_id === bookId);
      const bookNotes = notes.filter(n => n.book_id === bookId);

      const backupData = {
        version: '1.0',
        exported_at: new Date().toISOString(),
        type: 'single_book',
        data: {
          book,
          sessions: bookSessions,
          notes: bookNotes,
        },
      };

      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reading-book-${book.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${book.id}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Register backup
      const metadata: BackupMetadata = {
        backup_type: 'single_book',
        book_id: bookId,
        session_count: bookSessions.length,
        note_count: bookNotes.length,
      };
      
      try {
        await registerBackup('', link.download, 'single_book', metadata);
      } catch (err) {
        console.error('Failed to register backup:', err);
      }

      alert(`Book data exported successfully!`);
      setSelectedBookId(undefined); // Reset selection after export
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to export book data');
      console.error('Export error:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleExportNotes = async () => {
    try {
      setExporting(true);
      
      const backupData = {
        version: '1.0',
        exported_at: new Date().toISOString(),
        type: 'notes',
        data: {
          notes,
        },
      };

      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reading-notes-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Register backup
      const metadata: BackupMetadata = {
        backup_type: 'notes',
        note_count: notes.length,
      };
      
      try {
        await registerBackup('', link.download, 'notes', metadata);
      } catch (err) {
        console.error('Failed to register backup:', err);
      }

      alert(`Notes exported successfully!`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to export notes');
      console.error('Export error:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleImportBackup = async () => {
    try {
      setImporting(true);
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const jsonString = event.target?.result as string;
            
            // Validate backup structure
            await validateBackupJson(jsonString);
            
            const backupData = JSON.parse(jsonString);
            
            // Show preview
            const preview = `This backup contains:\n` +
              `- Books: ${backupData.data?.books?.length || 0}\n` +
              `- Sessions: ${backupData.data?.sessions?.length || 0}\n` +
              `- Notes: ${backupData.data?.notes?.length || 0}\n` +
              `- Goals: ${backupData.data?.goals?.length || 0}\n\n` +
              `What would you like to do?`;
            
            // TODO: Implement merge/overwrite logic
            // const shouldMerge = confirm(preview + '\n\nOK = Merge with existing data\nCancel = Overwrite all data');
            confirm(preview + '\n\nOK = Merge with existing data\nCancel = Overwrite all data');
            alert('Import functionality will be implemented in the next phase');
          } catch (err) {
            alert('Invalid backup file: ' + (err instanceof Error ? err.message : 'Unknown error'));
          } finally {
            setImporting(false);
          }
        };
        
        reader.readAsText(file);
      };
      
      input.click();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to import backup');
      setImporting(false);
    }
  };

  return (
    <Container>
      <div className="py-8">
        <Stack spacing="lg">
          {/* Header */}
          <div>
            <Heading level={1}>The Study's Instruments</Heading>
            <Paragraph variant="secondary" className="mt-2">
              Configure your reading experience
            </Paragraph>
          </div>

          {/* Tabs */}
          <div className="flex items-center space-x-1 border-b border-background-border">
            <button
              onClick={() => setActiveTab('appearance')}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === 'appearance'
                  ? 'text-accent-primary border-b-2 border-accent-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Palette className="w-4 h-4" />
                <span>Appearance</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('behavior')}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === 'behavior'
                  ? 'text-accent-primary border-b-2 border-accent-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Behavior</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === 'notifications'
                  ? 'text-accent-primary border-b-2 border-accent-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === 'data'
                  ? 'text-accent-primary border-b-2 border-accent-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4" />
                <span>Data</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('shortcuts')}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === 'shortcuts'
                  ? 'text-accent-primary border-b-2 border-accent-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Keyboard className="w-4 h-4" />
                <span>Shortcuts</span>
              </div>
            </button>
          </div>

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <Stack spacing="md">
              {/* Theme */}
              <Section padding="md">
                <Stack spacing="sm">
                  <div className="flex items-center space-x-3">
                    {theme === 'dark' ? (
                      <Moon className="w-5 h-5 text-accent-primary" />
                    ) : (
                      <Sun className="w-5 h-5 text-accent-primary" />
                    )}
                    <Heading level={4}>Theme</Heading>
                  </div>
                  <Paragraph variant="secondary" className="text-sm">
                    Choose between light and dark mode
                  </Paragraph>
                  <div className="flex items-center space-x-4 pt-2">
                    <HandDrawnBox
                      borderRadius={6}
                      strokeWidth={1}
                      linearCorners={true}
                    >
                      <button
                        onClick={() => handleThemeChange('light')}
                        className={cn(
                          'relative w-full flex items-center justify-center space-x-2 px-4 py-2 transition-colors overflow-hidden',
                          theme === 'light'
                            ? 'text-accent-primary font-medium bg-accent-primary/10'
                            : 'text-text-secondary hover:bg-background-surface'
                        )}
                        style={{
                          backgroundImage: theme === 'light' ? `repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 2px,
                            rgba(46, 74, 120, 0.2) 2px,
                            rgba(46, 74, 120, 0.2) 3px
                          )` : undefined,
                        }}
                      >
                        <Sun className="w-4 h-4" />
                        <span>Light</span>
                      </button>
                    </HandDrawnBox>
                    <HandDrawnBox
                      borderRadius={6}
                      strokeWidth={1}
                      linearCorners={true}
                    >
                      <button
                        onClick={() => handleThemeChange('dark')}
                        className={cn(
                          'relative w-full flex items-center justify-center space-x-2 px-4 py-2 transition-colors overflow-hidden',
                          theme === 'dark'
                            ? 'text-accent-primary font-medium bg-accent-primary/10'
                            : 'text-text-secondary hover:bg-background-surface'
                        )}
                        style={{
                          backgroundImage: theme === 'dark' ? `repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 2px,
                            rgba(46, 74, 120, 0.2) 2px,
                            rgba(46, 74, 120, 0.2) 3px
                          )` : undefined,
                        }}
                      >
                        <Moon className="w-4 h-4" />
                        <span>Dark</span>
                      </button>
                    </HandDrawnBox>
                  </div>
                </Stack>
              </Section>

              {/* Font Size */}
              <Section padding="md">
                <Stack spacing="sm">
                  <div className="flex items-center space-x-3">
                    <Type className="w-5 h-5 text-accent-primary" />
                    <Heading level={4}>Font Size</Heading>
                  </div>
                  <Paragraph variant="secondary" className="text-sm">
                    Adjust the global font size for better readability
                  </Paragraph>
                  <div className="flex items-center space-x-4 pt-2">
                    {(['small', 'standard', 'large'] as const).map((size) => (
                      <HandDrawnBox
                        key={size}
                        borderRadius={6}
                        strokeWidth={1}
                        linearCorners={true}
                      >
                        <button
                          onClick={() => handleFontSizeChange(size)}
                          className={cn(
                            'relative w-full px-4 py-2 transition-colors capitalize overflow-hidden',
                            fontSize === size
                              ? 'text-accent-primary font-medium bg-accent-primary/10'
                              : 'text-text-secondary hover:bg-background-surface'
                          )}
                          style={{
                            backgroundImage: fontSize === size ? `repeating-linear-gradient(
                              45deg,
                              transparent,
                              transparent 2px,
                              rgba(46, 74, 120, 0.2) 2px,
                              rgba(46, 74, 120, 0.2) 3px
                            )` : undefined,
                          }}
                        >
                          {size}
                        </button>
                      </HandDrawnBox>
                    ))}
                  </div>
                </Stack>
              </Section>

              {/* Line Spacing */}
              <Section padding="md">
                <Stack spacing="sm">
                  <div className="flex items-center space-x-3">
                    <Type className="w-5 h-5 text-accent-primary" />
                    <Heading level={4}>Line Spacing</Heading>
                  </div>
                  <Paragraph variant="secondary" className="text-sm">
                    Adjust line spacing for reading comfort
                  </Paragraph>
                  <div className="flex items-center space-x-4 pt-2">
                    {(['tight', 'normal', 'relaxed', 'loose'] as const).map((spacing) => (
                      <HandDrawnBox
                        key={spacing}
                        borderRadius={6}
                        strokeWidth={1}
                        linearCorners={true}
                      >
                        <button
                          onClick={() => handleLineSpacingChange(spacing)}
                          className={cn(
                            'relative w-full px-4 py-2 transition-colors capitalize overflow-hidden',
                            lineSpacing === spacing
                              ? 'text-accent-primary font-medium bg-accent-primary/10'
                              : 'text-text-secondary hover:bg-background-surface'
                          )}
                          style={{
                            backgroundImage: lineSpacing === spacing ? `repeating-linear-gradient(
                              45deg,
                              transparent,
                              transparent 2px,
                              rgba(46, 74, 120, 0.2) 2px,
                              rgba(46, 74, 120, 0.2) 3px
                            )` : undefined,
                          }}
                        >
                          {spacing}
                        </button>
                      </HandDrawnBox>
                    ))}
                  </div>
                </Stack>
              </Section>

              {/* High Contrast Mode */}
              <Section padding="md">
                <Stack spacing="sm">
                  <div className="flex items-center space-x-3">
                    <Contrast className="w-5 h-5 text-accent-primary" />
                    <Heading level={4}>High Contrast Mode</Heading>
                  </div>
                  <Paragraph variant="secondary" className="text-sm">
                    Increase contrast for better visibility and accessibility
                  </Paragraph>
                  <div className="pt-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={highContrast}
                        onChange={(e) => handleHighContrastChange(e.target.checked)}
                        className="w-5 h-5 rounded border-background-border text-accent-primary focus:ring-2 focus:ring-accent-primary"
                      />
                      <span className="text-sm">Enable High Contrast Mode</span>
                    </label>
                  </div>
                </Stack>
              </Section>

              {/* High Focus Mode */}
              <Section padding="md">
                <Stack spacing="sm">
                  <div className="flex items-center space-x-3">
                    <Focus className="w-5 h-5 text-accent-primary" />
                    <Heading level={4}>High Focus Mode</Heading>
                  </div>
                  <Paragraph variant="secondary" className="text-sm">
                    Reduce visual distractions by hiding decorative elements and secondary cards
                  </Paragraph>
                  <div className="pt-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={highFocusMode}
                        onChange={(e) => handleHighFocusModeChange(e.target.checked)}
                        className="w-5 h-5 rounded border-background-border text-accent-primary focus:ring-2 focus:ring-accent-primary"
                      />
                      <span className="text-sm">Enable High Focus Mode</span>
                    </label>
                  </div>
                </Stack>
              </Section>

              {/* Reduced Motion */}
              <Section padding="md">
                <Stack spacing="sm">
                  <div className="flex items-center space-x-3">
                    <Minimize2 className="w-5 h-5 text-accent-primary" />
                    <Heading level={4}>Reduced Motion</Heading>
                  </div>
                  <Paragraph variant="secondary" className="text-sm">
                    Disable animations and transitions for users sensitive to motion
                  </Paragraph>
                  <div className="pt-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reducedMotion}
                        onChange={(e) => handleReducedMotionChange(e.target.checked)}
                        className="w-5 h-5 rounded border-background-border text-accent-primary focus:ring-2 focus:ring-accent-primary"
                      />
                      <span className="text-sm">Enable Reduced Motion</span>
                    </label>
                  </div>
                </Stack>
              </Section>
            </Stack>
          )}

          {/* Behavior Tab */}
          {activeTab === 'behavior' && (
            <Stack spacing="md">
              {/* Default Progress Unit */}
              <Section padding="md">
                <Stack spacing="sm">
                  <div className="flex items-center space-x-3">
                    <Type className="w-5 h-5 text-accent-primary" />
                    <Heading level={4}>Default Progress Unit</Heading>
                  </div>
                  <Paragraph variant="secondary" className="text-sm">
                    Choose how progress is displayed by default (pages or percentage)
                  </Paragraph>
                  <div className="flex items-center space-x-4 pt-2">
                    <HandDrawnBox
                      borderRadius={6}
                      strokeWidth={1}
                      linearCorners={true}
                    >
                      <button
                        onClick={() => handleProgressUnitChange('page')}
                        className={cn(
                          'relative w-full px-4 py-2 transition-colors overflow-hidden',
                          defaultProgressUnit === 'page'
                            ? 'text-accent-primary font-medium bg-accent-primary/10'
                            : 'text-text-secondary hover:bg-background-surface'
                        )}
                        style={{
                          backgroundImage: defaultProgressUnit === 'page' ? `repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 2px,
                            rgba(46, 74, 120, 0.2) 2px,
                            rgba(46, 74, 120, 0.2) 3px
                          )` : undefined,
                        }}
                      >
                        Pages
                      </button>
                    </HandDrawnBox>
                    <HandDrawnBox
                      borderRadius={6}
                      strokeWidth={1}
                      linearCorners={true}
                    >
                      <button
                        onClick={() => handleProgressUnitChange('percentage')}
                        className={cn(
                          'relative w-full px-4 py-2 transition-colors overflow-hidden',
                          defaultProgressUnit === 'percentage'
                            ? 'text-accent-primary font-medium bg-accent-primary/10'
                            : 'text-text-secondary hover:bg-background-surface'
                        )}
                        style={{
                          backgroundImage: defaultProgressUnit === 'percentage' ? `repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 2px,
                            rgba(46, 74, 120, 0.2) 2px,
                            rgba(46, 74, 120, 0.2) 3px
                          )` : undefined,
                        }}
                      >
                        Percentage
                      </button>
                    </HandDrawnBox>
                  </div>
                </Stack>
              </Section>

              {/* Default Session Behavior */}
              <Section padding="md">
                <Stack spacing="sm">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-accent-primary" />
                    <Heading level={4}>Default Session Behavior</Heading>
                  </div>
                  <Paragraph variant="secondary" className="text-sm">
                    Configure how new reading sessions behave
                  </Paragraph>
                  <div className="pt-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoOpenTimer}
                        onChange={(e) => handleAutoOpenTimerChange(e.target.checked)}
                        className="w-5 h-5 rounded border-background-border text-accent-primary focus:ring-2 focus:ring-accent-primary"
                      />
                      <span className="text-sm">Open timer automatically when starting a session</span>
                    </label>
                  </div>
                </Stack>
              </Section>

              {/* Default Start Page */}
              <Section padding="md">
                <Stack spacing="sm">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-accent-primary" />
                    <Heading level={4}>Default Start Page</Heading>
                  </div>
                  <Paragraph variant="secondary" className="text-sm">
                    Set the default starting page when creating a new book
                  </Paragraph>
                  <div className="pt-2">
                    <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-32">
                      <input
                        type="number"
                        min="1"
                        value={defaultStartPage}
                        onChange={(e) => handleDefaultStartPageChange(e.target.value)}
                        className="w-full px-3 py-2 bg-transparent text-text-primary focus:outline-none border-0"
                        placeholder="1"
                      />
                    </HandDrawnBox>
                    <MetaText className="text-xs text-text-secondary mt-1 block">
                      Usually 1, but you can set a different default if needed
                    </MetaText>
                  </div>
                </Stack>
              </Section>
            </Stack>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Stack spacing="md">
              {/* Daily Reminder */}
              <Section padding="md">
                <Stack spacing="sm">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-accent-primary" />
                    <Heading level={4}>Daily Reminder</Heading>
                  </div>
                  <Paragraph variant="secondary" className="text-sm">
                    Receive a daily reminder to read
                  </Paragraph>
                  <div className="pt-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={dailyReminder}
                        onChange={(e) => handleDailyReminderChange(e.target.checked)}
                        className="w-5 h-5 rounded border-background-border text-accent-primary focus:ring-2 focus:ring-accent-primary"
                      />
                      <span className="text-sm">Enable daily reading reminder</span>
                    </label>
                  </div>
                  <MetaText className="text-xs text-text-secondary">
                    Note: Notification implementation will be added in a future update
                  </MetaText>
                </Stack>
              </Section>

              {/* Reading Prompt */}
              <Section padding="md">
                <Stack spacing="sm">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-accent-primary" />
                    <Heading level={4}>Reading Prompt</Heading>
                  </div>
                  <Paragraph variant="secondary" className="text-sm">
                    Get prompted if you haven't read today
                  </Paragraph>
                  <div className="pt-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={readingPrompt}
                        onChange={(e) => handleReadingPromptChange(e.target.checked)}
                        className="w-5 h-5 rounded border-background-border text-accent-primary focus:ring-2 focus:ring-accent-primary"
                      />
                      <span className="text-sm">Show prompt if you haven't read today</span>
                    </label>
                  </div>
                  <MetaText className="text-xs text-text-secondary">
                    A gentle reminder will appear if no reading session was recorded today
                  </MetaText>
                </Stack>
              </Section>

              {/* Goal Reminders */}
              <Section padding="md">
                <Stack spacing="sm">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-accent-primary" />
                    <Heading level={4}>Goal Reminders</Heading>
                  </div>
                  <Paragraph variant="secondary" className="text-sm">
                    Receive reminders about your reading goals
                  </Paragraph>
                  <div className="pt-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={goalReminders}
                        onChange={(e) => handleGoalRemindersChange(e.target.checked)}
                        className="w-5 h-5 rounded border-background-border text-accent-primary focus:ring-2 focus:ring-accent-primary"
                      />
                      <span className="text-sm">Enable goal progress reminders</span>
                    </label>
                  </div>
                  <MetaText className="text-xs text-text-secondary">
                    Get notified about your progress toward monthly and yearly goals
                  </MetaText>
                </Stack>
              </Section>
            </Stack>
          )}

          {/* Data Tab */}
          {activeTab === 'data' && (
            <Stack spacing="md">
              {/* Last Backup Date */}
              {lastBackupDate && (
                <Section padding="md">
                  <Stack spacing="sm">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-accent-primary" />
                      <Heading level={4}>Last Backup</Heading>
                    </div>
                    <MetaText className="text-sm">
                      Last full backup: {new Date(lastBackupDate).toLocaleString()}
                    </MetaText>
                  </Stack>
                </Section>
              )}

              {/* Export Full Backup */}
              <Section padding="md">
                <Stack spacing="sm">
                  <div className="flex items-center space-x-3">
                    <Download className="w-5 h-5 text-accent-primary" />
                    <Heading level={4}>Export Full Backup</Heading>
                  </div>
                  <Paragraph variant="secondary" className="text-sm">
                    Create a complete backup of all your data (books, sessions, notes, goals, journal, agenda)
                  </Paragraph>
                  <div className="pt-2">
                    <Button
                      onClick={handleExportData}
                      disabled={exporting}
                      variant="primary"
                      size="md"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      <span>{exporting ? 'Exporting...' : 'Export Full Backup'}</span>
                    </Button>
                  </div>
                  <MetaText className="text-xs text-text-secondary uppercase">
                    The backup will be saved as a JSON file containing all your reading data
                  </MetaText>
                </Stack>
              </Section>

              {/* Partial Exports */}
              <Section padding="md">
                <Stack spacing="sm">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-accent-primary" />
                    <Heading level={4}>Partial Exports</Heading>
                  </div>
                  <Paragraph variant="secondary" className="text-sm">
                    Export specific data for research, sharing, or analysis
                  </Paragraph>
                  
                  <div className="pt-2 space-y-3">
                    {/* Export Year Statistics */}
                    <div className="flex items-center justify-between p-3 rounded-md bg-background-surface">
                      <div className="flex-1">
                        <Paragraph className="text-sm font-medium">Export Year Statistics</Paragraph>
                        <MetaText className="text-xs uppercase">Sessions and books completed in a specific year</MetaText>
                      </div>
                      <div className="ml-4">
                        <Button
                          onClick={() => {
                            const currentYear = new Date().getFullYear();
                            const yearInput = prompt(`Enter year to export:`, currentYear.toString());
                            if (yearInput) {
                              const year = parseInt(yearInput);
                              if (!isNaN(year)) {
                                handleExportYearStats(year);
                              }
                            }
                          }}
                          disabled={exporting}
                          variant="outline"
                          size="sm"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>Export</span>
                        </Button>
                      </div>
                    </div>

                    {/* Export Single Book */}
                    <div className="flex items-center justify-between p-3 rounded-md bg-background-surface">
                      <div className="flex-1">
                        <Paragraph className="text-sm font-medium">Export Single Book</Paragraph>
                        <MetaText className="text-xs uppercase">Book data, sessions, and notes for research</MetaText>
                      </div>
                      <div className="ml-4 min-w-[200px]">
                        <HandDrawnDropdown
                          options={books.map((book) => ({
                            value: book.id ?? 0,
                            label: book.title,
                          }))}
                          value={selectedBookId}
                          placeholder="Select book..."
                          onChange={(value) => {
                            if (value && typeof value === 'number') {
                              setSelectedBookId(value);
                              handleExportSingleBook(value);
                            }
                          }}
                          disabled={exporting}
                          borderRadius={6}
                          strokeWidth={1}
                        />
                      </div>
                    </div>

                    {/* Export Notes */}
                    <div className="flex items-center justify-between p-3 rounded-md bg-background-surface">
                      <div className="flex-1">
                        <Paragraph className="text-sm font-medium">Export Notes</Paragraph>
                        <MetaText className="text-xs uppercase">All your notes and highlights</MetaText>
                      </div>
                      <div className="ml-4">
                        <Button
                          onClick={handleExportNotes}
                          disabled={exporting}
                          variant="outline"
                          size="sm"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          <span>Export</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Stack>
              </Section>

              {/* Import Backup */}
              <Section padding="md">
                <Stack spacing="sm">
                  <div className="flex items-center space-x-3">
                    <Upload className="w-5 h-5 text-accent-primary" />
                    <Heading level={4}>Import Backup</Heading>
                  </div>
                  <Paragraph variant="secondary" className="text-sm">
                    Restore data from a backup file
                  </Paragraph>
                  <div className="pt-2">
                    <Button
                      onClick={handleImportBackup}
                      disabled={importing || exporting}
                      variant="outline"
                      size="md"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      <span>{importing ? 'Importing...' : 'Import Backup'}</span>
                    </Button>
                  </div>
                  <MetaText className="text-xs text-semantic-warning uppercase flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Import functionality will validate the backup and allow you to merge or overwrite data</span>
                  </MetaText>
                </Stack>
              </Section>
            </Stack>
          )}

          {/* Shortcuts Tab */}
          {activeTab === 'shortcuts' && (
            <Stack spacing="md">
              <Section padding="md">
                <Stack spacing="md">
                  <div className="flex items-center space-x-3">
                    <Keyboard className="w-5 h-5 text-accent-primary" />
                    <Heading level={4}>Keyboard Shortcuts</Heading>
                  </div>
                  <Paragraph variant="secondary" className="text-sm">
                    Quick access to features using keyboard shortcuts
                  </Paragraph>

                  {/* Group shortcuts by category */}
                  {['Navigation', 'Actions'].map((category) => (
                    <div key={category}>
                      <Heading level={5} className="text-sm font-medium mb-3">
                        {category}
                      </Heading>
                      <div className="space-y-2">
                        {defaultShortcuts
                          .filter((s) => s.category === category)
                          .map((shortcut, index) => (
                            <HandDrawnBox key={index} borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                              <div className="flex items-center justify-between p-3 bg-background-surface">
                                <span className="text-sm text-text-primary">
                                  {shortcut.description}
                                </span>
                                <div className="flex items-center space-x-1">
                                  {shortcut.ctrl && (
                                    <HandDrawnBox borderRadius={4} strokeWidth={1} linearCorners={true}>
                                      <kbd className="px-2 py-1 text-xs font-semibold text-text-secondary bg-background-surface block">
                                        {navigator.platform.toLowerCase().includes('mac') ? '⌘' : 'Ctrl'}
                                      </kbd>
                                    </HandDrawnBox>
                                  )}
                                  {shortcut.shift && (
                                    <HandDrawnBox borderRadius={4} strokeWidth={1} linearCorners={true}>
                                      <kbd className="px-2 py-1 text-xs font-semibold text-text-secondary bg-background-surface block">
                                        Shift
                                      </kbd>
                                    </HandDrawnBox>
                                  )}
                                  <HandDrawnBox borderRadius={4} strokeWidth={1} linearCorners={true}>
                                    <kbd className="px-2 py-1 text-xs font-semibold text-text-primary bg-accent-primary/20 block">
                                      {shortcut.key.toUpperCase()}
                                    </kbd>
                                  </HandDrawnBox>
                                </div>
                              </div>
                            </HandDrawnBox>
                          ))}
                      </div>
                    </div>
                  ))}

                  {/* General Navigation */}
                  <div>
                    <Heading level={5} className="text-sm font-medium mb-3">
                      General Navigation
                    </Heading>
                    <div className="space-y-2">
                      <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                        <div className="flex items-center justify-between p-3 bg-background-surface">
                          <span className="text-sm text-text-primary">Close Modals / Dialogs</span>
                          <HandDrawnBox borderRadius={4} strokeWidth={1} linearCorners={true}>
                            <kbd className="px-2 py-1 text-xs font-semibold text-text-primary bg-accent-primary/20 block">
                              Esc
                            </kbd>
                          </HandDrawnBox>
                        </div>
                      </HandDrawnBox>
                      <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                        <div className="flex items-center justify-between p-3 bg-background-surface">
                          <span className="text-sm text-text-primary">Navigate with Tab</span>
                          <HandDrawnBox borderRadius={4} strokeWidth={1} linearCorners={true}>
                            <kbd className="px-2 py-1 text-xs font-semibold text-text-primary bg-accent-primary/20 block">
                              Tab
                            </kbd>
                          </HandDrawnBox>
                        </div>
                      </HandDrawnBox>
                      <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                        <div className="flex items-center justify-between p-3 bg-background-surface">
                          <span className="text-sm text-text-primary">Navigate lists with arrows</span>
                          <div className="flex items-center space-x-1">
                            <HandDrawnBox borderRadius={4} strokeWidth={1} linearCorners={true}>
                              <kbd className="px-2 py-1 text-xs font-semibold text-text-primary bg-accent-primary/20 block">
                                ↑
                              </kbd>
                            </HandDrawnBox>
                            <HandDrawnBox borderRadius={4} strokeWidth={1} linearCorners={true}>
                              <kbd className="px-2 py-1 text-xs font-semibold text-text-primary bg-accent-primary/20 block">
                                ↓
                              </kbd>
                            </HandDrawnBox>
                          </div>
                        </div>
                      </HandDrawnBox>
                      <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                        <div className="flex items-center justify-between p-3 bg-background-surface">
                          <span className="text-sm text-text-primary">Open selected item</span>
                          <HandDrawnBox borderRadius={4} strokeWidth={1} linearCorners={true}>
                            <kbd className="px-2 py-1 text-xs font-semibold text-text-primary bg-accent-primary/20 block">
                              Enter
                            </kbd>
                          </HandDrawnBox>
                        </div>
                      </HandDrawnBox>
                    </div>
                  </div>
                </Stack>
              </Section>
            </Stack>
          )}
        </Stack>
      </div>
    </Container>
  );
}

