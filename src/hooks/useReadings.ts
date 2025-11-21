import { invoke } from '@tauri-apps/api/core';
import { useState, useEffect } from 'react';

export interface ReadingDto {
  id: number | null;
  book_id: number;
  reading_number: number; // 1 = first read, 2 = first reread, etc.
  started_at: string | null; // RFC3339 format
  completed_at: string | null; // RFC3339 format
  status: 'not_started' | 'reading' | 'paused' | 'abandoned' | 'completed';
  created_at: string; // RFC3339 format
}

export interface CreateReadingCommand {
  book_id: number;
}

export function useReadings(bookId: number | null) {
  const [readings, setReadings] = useState<ReadingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookId) {
      loadReadings();
    } else {
      setReadings([]);
      setLoading(false);
    }
  }, [bookId]);

  const loadReadings = async () => {
    if (!bookId) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await invoke<ReadingDto[]>('list_readings', { book_id: bookId });
      setReadings(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load readings');
    } finally {
      setLoading(false);
    }
  };

  return { readings, loading, error, refresh: loadReadings };
}

export function useCurrentReading(bookId: number | null) {
  const [reading, setReading] = useState<ReadingDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookId) {
      loadCurrentReading();
    } else {
      setReading(null);
      setLoading(false);
    }
  }, [bookId]);

  const loadCurrentReading = async () => {
    if (!bookId) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await invoke<ReadingDto | null>('get_current_reading', { book_id: bookId });
      setReading(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load current reading');
    } finally {
      setLoading(false);
    }
  };

  return { reading, loading, error, refresh: loadCurrentReading };
}

export async function createReading(command: CreateReadingCommand): Promise<ReadingDto> {
  return await invoke<ReadingDto>('create_reading', { command });
}

export async function getReading(id: number): Promise<ReadingDto> {
  return await invoke<ReadingDto>('get_reading', { id });
}

