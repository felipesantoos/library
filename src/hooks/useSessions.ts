import { invoke } from '@tauri-apps/api/core';
import { useState, useEffect } from 'react';

export interface SessionDto {
  id: number | null;
  book_id: number;
  reading_id: number | null;
  session_date: string;
  start_time: string | null;
  end_time: string | null;
  start_page: number | null;
  end_page: number | null;
  pages_read: number | null;
  minutes_read: number | null;
  duration_seconds: number | null;
  notes: string | null;
  photo_path: string | null;
  created_at: string;
  updated_at: string;
  duration_formatted: string;
}

export interface CreateSessionCommand {
  book_id: number;
  reading_id?: number | null;
  session_date: string; // YYYY-MM-DD
  start_time?: string | null; // HH:MM:SS
  end_time?: string | null; // HH:MM:SS
  start_page?: number | null;
  end_page?: number | null;
  minutes_read?: number | null;
  notes?: string | null;
}

export interface UpdateSessionCommand {
  id: number;
  session_date?: string; // YYYY-MM-DD
  start_time?: string | null; // HH:MM:SS
  end_time?: string | null; // HH:MM:SS
  start_page?: number | null;
  end_page?: number | null;
  minutes_read?: number | null;
  notes?: string | null;
}

export function useSessions(filters?: {
  book_id?: number;
  start_date?: string;
  end_date?: string;
}) {
  const [sessions, setSessions] = useState<SessionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, [filters]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await invoke<SessionDto[]>('list_sessions', {
        book_id: filters?.book_id ?? null,
        start_date: filters?.start_date ?? null,
        end_date: filters?.end_date ?? null,
      });
      setSessions(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  return { sessions, loading, error, refresh: loadSessions };
}

export function useSession(id: number | null) {
  const [session, setSession] = useState<SessionDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setSession(null);
      setLoading(false);
      return;
    }
    loadSession(id);
  }, [id]);

  const loadSession = async (sessionId: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await invoke<SessionDto>('get_session', { id: sessionId });
      setSession(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load session');
    } finally {
      setLoading(false);
    }
  };

  return { session, loading, error, refresh: () => id !== null && loadSession(id) };
}

export async function createSession(command: CreateSessionCommand): Promise<SessionDto> {
  return await invoke<SessionDto>('create_session', { command });
}

export async function updateSession(command: UpdateSessionCommand): Promise<SessionDto> {
  return await invoke<SessionDto>('update_session', { command });
}

export async function deleteSession(id: number): Promise<void> {
  return await invoke<void>('delete_session', { id });
}

