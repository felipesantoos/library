import { useState, useEffect } from 'react';
import { useSettings, setSetting } from '@/hooks/useSettings';

export function useNotificationSettings() {
  const { settings } = useSettings();

  // Helper to get setting value from backend or localStorage
  const getSettingValue = (key: string, defaultValue: string): string => {
    const setting = settings.find(s => s.key === key);
    if (setting) {
      localStorage.setItem(key, setting.value);
      return setting.value;
    }
    return localStorage.getItem(key) || defaultValue;
  };

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
      setDailyReminder(getSettingValue('dailyReminder', 'false') === 'true');
      setReadingPrompt(getSettingValue('readingPrompt', 'false') === 'true');
      setGoalReminders(getSettingValue('goalReminders', 'false') === 'true');
    }
  }, [settings]);

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

  return {
    dailyReminder,
    readingPrompt,
    goalReminders,
    handleDailyReminderChange,
    handleReadingPromptChange,
    handleGoalRemindersChange,
  };
}

