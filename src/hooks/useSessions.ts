import { invoke } from '@tauri-apps/api/core';
import { useState, useEffect, useCallback } from 'react';

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

  // Extrair valores primitivos para usar como dependências estáveis
  const bookId = filters?.book_id;
  const startDate = filters?.start_date;
  const endDate = filters?.end_date;

  useEffect(() => {
    let cancelled = false;

    const loadSessions = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await invoke<SessionDto[]>('list_sessions', {
          book_id: bookId ?? null,
          start_date: startDate ?? null,
          end_date: endDate ?? null,
        });
        if (!cancelled) {
          setSessions(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load sessions');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadSessions();

    return () => {
      cancelled = true;
    };
  }, [bookId, startDate, endDate]);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await invoke<SessionDto[]>('list_sessions', {
        book_id: bookId ?? null,
        start_date: startDate ?? null,
        end_date: endDate ?? null,
      });
      setSessions(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  }, [bookId, startDate, endDate]);

  return { sessions, loading, error, refresh };
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

    let cancelled = false;

    const loadSession = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await invoke<SessionDto>('get_session', { id });
        if (!cancelled) {
          setSession(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load session');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadSession();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const refresh = useCallback(async () => {
    if (id === null) return;
    try {
      setLoading(true);
      setError(null);
      const result = await invoke<SessionDto>('get_session', { id });
      setSession(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load session');
    } finally {
      setLoading(false);
    }
  }, [id]);

  return { session, loading, error, refresh };
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

