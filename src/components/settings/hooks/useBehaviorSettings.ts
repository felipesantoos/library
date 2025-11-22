import { useState, useEffect } from 'react';
import { useSettings, setSetting } from '@/hooks/useSettings';

export function useBehaviorSettings() {
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

  // Sync settings from backend when they load
  useEffect(() => {
    if (settings.length > 0) {
      const progressUnit = getSettingValue('defaultProgressUnit', 'page');
      if (progressUnit === 'page' || progressUnit === 'percentage') {
        setDefaultProgressUnit(progressUnit);
      }
      setAutoOpenTimer(getSettingValue('autoOpenTimer', 'false') === 'true');
      setDefaultStartPage(getSettingValue('defaultStartPage', '1'));
    }
  }, [settings]);

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

  return {
    defaultProgressUnit,
    autoOpenTimer,
    defaultStartPage,
    handleProgressUnitChange,
    handleAutoOpenTimerChange,
    handleDefaultStartPageChange,
  };
}

