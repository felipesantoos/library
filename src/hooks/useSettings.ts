import { invoke } from '@tauri-apps/api/core';
import { useState, useEffect } from 'react';

export interface SettingDto {
  key: string;
  value: string;
  updated_at: string;
}

export function useSettings() {
  const [settings, setSettings] = useState<SettingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await invoke<SettingDto[]>('get_all_settings');
      setSettings(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading, error, refresh: loadSettings };
}

export function useSetting(key: string) {
  const [setting, setSetting] = useState<SettingDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSetting();
  }, [key]);

  const loadSetting = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await invoke<SettingDto | null>('get_setting', { key });
      setSetting(result || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load setting');
    } finally {
      setLoading(false);
    }
  };

  return { setting, loading, error, refresh: loadSetting };
}

export async function setSetting(key: string, value: string): Promise<SettingDto> {
  return await invoke<SettingDto>('set_setting', { key, value });
}

