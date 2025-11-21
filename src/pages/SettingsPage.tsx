import React, { useState } from 'react';
import { useTheme } from '@/theme';
import { Container, Stack, Section } from '@/components/ui/layout';
import { Heading, Paragraph, MetaText } from '@/components/ui/typography';
import { Moon, Sun, Type, Focus, Download, Database, Palette } from 'lucide-react';
import { setSetting } from '@/hooks/useSettings';
import { invoke } from '@tauri-apps/api/core';

export function SettingsPage() {
  const { theme, setTheme, fontSize, setFontSize, highFocusMode, setHighFocusMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'appearance' | 'data'>('appearance');
  const [exporting, setExporting] = useState(false);

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

      alert('Backup exported successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to export backup');
      console.error('Export error:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <Container>
      <div className="py-8 max-w-4xl">
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
                    <button
                      onClick={() => handleThemeChange('light')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-md border transition-colors ${
                        theme === 'light'
                          ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                          : 'border-background-border text-text-secondary hover:bg-background-surface'
                      }`}
                    >
                      <Sun className="w-4 h-4" />
                      <span>Light</span>
                    </button>
                    <button
                      onClick={() => handleThemeChange('dark')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-md border transition-colors ${
                        theme === 'dark'
                          ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                          : 'border-background-border text-text-secondary hover:bg-background-surface'
                      }`}
                    >
                      <Moon className="w-4 h-4" />
                      <span>Dark</span>
                    </button>
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
                      <button
                        key={size}
                        onClick={() => handleFontSizeChange(size)}
                        className={`px-4 py-2 rounded-md border transition-colors capitalize ${
                          fontSize === size
                            ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                            : 'border-background-border text-text-secondary hover:bg-background-surface'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
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
            </Stack>
          )}

          {/* Data Tab */}
          {activeTab === 'data' && (
            <Stack spacing="md">
              {/* Export Backup */}
              <Section padding="md">
                <Stack spacing="sm">
                  <div className="flex items-center space-x-3">
                    <Download className="w-5 h-5 text-accent-primary" />
                    <Heading level={4}>Export Backup</Heading>
                  </div>
                  <Paragraph variant="secondary" className="text-sm">
                    Create a full backup of all your data (books, sessions, notes, goals)
                  </Paragraph>
                  <div className="pt-2">
                    <button
                      onClick={handleExportData}
                      disabled={exporting}
                      className="flex items-center space-x-2 px-4 py-2 rounded-md bg-accent-primary text-white hover:bg-accent-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-4 h-4" />
                      <span>{exporting ? 'Exporting...' : 'Export Full Backup'}</span>
                    </button>
                  </div>
                  <MetaText className="text-xs text-text-secondary">
                    The backup will be saved as a JSON file containing all your reading data
                  </MetaText>
                </Stack>
              </Section>
            </Stack>
          )}
        </Stack>
      </div>
    </Container>
  );
}

