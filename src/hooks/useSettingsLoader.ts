import { useEffect } from 'react';
import { useSettings } from './useSettings';
import { useTheme } from '@/theme';

/**
 * Hook to load and apply all settings from backend on app startup
 * This ensures settings persist across sessions
 */
export function useSettingsLoader() {
  const { settings, loading } = useSettings();
  const {
    setTheme,
    setFontSize,
    setHighFocusMode,
    setLineSpacing,
    setHighContrast,
    setReducedMotion,
  } = useTheme();

  useEffect(() => {
    if (loading || settings.length === 0) return;

    // Apply settings from backend
    settings.forEach((setting) => {
      switch (setting.key) {
        case 'theme':
          if (setting.value === 'light' || setting.value === 'dark') {
            setTheme(setting.value);
          }
          break;
        case 'fontSize':
          if (setting.value === 'small' || setting.value === 'standard' || setting.value === 'large') {
            setFontSize(setting.value);
          }
          break;
        case 'highFocusMode':
          setHighFocusMode(setting.value === 'true');
          break;
        case 'lineSpacing':
          if (setting.value === 'tight' || setting.value === 'normal' || setting.value === 'relaxed' || setting.value === 'loose') {
            setLineSpacing(setting.value);
          }
          break;
        case 'highContrast':
          setHighContrast(setting.value === 'true');
          break;
        case 'reducedMotion':
          setReducedMotion(setting.value === 'true');
          break;
        // Behavior settings
        case 'defaultProgressUnit':
          localStorage.setItem('defaultProgressUnit', setting.value);
          break;
        case 'autoOpenTimer':
          localStorage.setItem('autoOpenTimer', setting.value);
          break;
        case 'defaultStartPage':
          localStorage.setItem('defaultStartPage', setting.value);
          break;
        // Notification settings
        case 'dailyReminder':
          localStorage.setItem('dailyReminder', setting.value);
          break;
        case 'readingPrompt':
          localStorage.setItem('readingPrompt', setting.value);
          break;
        case 'goalReminders':
          localStorage.setItem('goalReminders', setting.value);
          break;
      }
    });
  }, [settings, loading, setTheme, setFontSize, setHighFocusMode, setLineSpacing, setHighContrast, setReducedMotion]);
}

