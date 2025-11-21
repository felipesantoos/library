import { invoke } from '@tauri-apps/api/core';
import { useState, useEffect, useCallback } from 'react';

export interface AgendaBlockDto {
  id: number | null;
  book_id: number | null;
  scheduled_date: string; // ISO date format: YYYY-MM-DD
  start_time: string | null; // ISO8601 time format (HH:MM:SS)
  end_time: string | null;   // ISO8601 time format (HH:MM:SS)
  is_completed: boolean;
  completed_session_id: number | null;
  notes: string | null;
  created_at: string; // RFC3339 format
  updated_at: string; // RFC3339 format
}

export interface CreateAgendaBlockCommand {
  book_id?: number | null;
  scheduled_date: string; // ISO date format: YYYY-MM-DD
  start_time?: string | null; // ISO8601 time format (HH:MM:SS)
  end_time?: string | null;   // ISO8601 time format (HH:MM:SS)
  notes?: string | null;
}

export interface UpdateAgendaBlockCommand {
  id: number;
  book_id?: number | null;
  scheduled_date: string; // ISO date format: YYYY-MM-DD
  start_time?: string | null; // ISO8601 time format (HH:MM:SS)
  end_time?: string | null;   // ISO8601 time format (HH:MM:SS)
  notes?: string | null;
}

export interface MarkBlockCompletedCommand {
  id: number;
  session_id: number;
}

export function useAgendaBlocks(
  bookId?: number | null,
  startDate?: string | null,
  endDate?: string | null,
  isCompleted?: boolean | null
) {
  const [blocks, setBlocks] = useState<AgendaBlockDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBlocks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await invoke<AgendaBlockDto[]>('list_agenda_blocks', {
        book_id: bookId ?? null,
        start_date: startDate ?? null,
        end_date: endDate ?? null,
        is_completed: isCompleted ?? null,
      });
      setBlocks(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load agenda blocks');
    } finally {
      setLoading(false);
    }
  }, [bookId, startDate, endDate, isCompleted]);

  useEffect(() => {
    loadBlocks();
  }, [loadBlocks]);

  return { blocks, loading, error, refresh: loadBlocks };
}

export function useAgendaBlock(id: number | null) {
  const [block, setBlock] = useState<AgendaBlockDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBlock = useCallback(async () => {
    if (!id) {
      setBlock(null);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const result = await invoke<AgendaBlockDto>('get_agenda_block', { id });
      setBlock(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load agenda block');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadBlock();
  }, [loadBlock]);

  return { block, loading, error, refresh: loadBlock };
}

export async function createAgendaBlock(
  command: CreateAgendaBlockCommand
): Promise<AgendaBlockDto> {
  return await invoke<AgendaBlockDto>('create_agenda_block', { command });
}

export async function updateAgendaBlock(
  command: UpdateAgendaBlockCommand
): Promise<AgendaBlockDto> {
  return await invoke<AgendaBlockDto>('update_agenda_block', { command });
}

export async function deleteAgendaBlock(id: number): Promise<void> {
  return await invoke<void>('delete_agenda_block', { id });
}

export async function markAgendaBlockCompleted(
  command: MarkBlockCompletedCommand
): Promise<AgendaBlockDto> {
  return await invoke<AgendaBlockDto>('mark_agenda_block_completed', { command });
}

