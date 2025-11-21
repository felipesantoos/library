import { invoke } from '@tauri-apps/api/core';
import { useState, useEffect } from 'react';

export interface BackupMetadata {
  backup_type: string;
  year?: number;
  book_id?: number;
  note_count?: number;
  session_count?: number;
  book_count?: number;
}

export async function registerBackup(
  filePath: string,
  fileName: string,
  backupType: string,
  metadata?: BackupMetadata
): Promise<number> {
  return await invoke<number>('register_backup', {
    file_path: filePath,
    file_name: fileName,
    backup_type: backupType,
    metadata,
  });
}

export async function getLastBackupDate(backupType?: string): Promise<string | null> {
  return await invoke<string | null>('get_last_backup_date', {
    backup_type: backupType,
  });
}

export async function validateBackupJson(jsonString: string): Promise<string> {
  return await invoke<string>('validate_backup_json', {
    json_string: jsonString,
  });
}

export function useLastBackupDate(backupType?: string) {
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLastBackupDate();
  }, [backupType]);

  const loadLastBackupDate = async () => {
    try {
      setLoading(true);
      setError(null);
      const date = await getLastBackupDate(backupType);
      setLastBackupDate(date);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load last backup date');
    } finally {
      setLoading(false);
    }
  };

  return { lastBackupDate, loading, error, refresh: loadLastBackupDate };
}

