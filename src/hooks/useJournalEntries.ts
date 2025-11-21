import { invoke } from '@tauri-apps/api/core';
import { useState, useEffect } from 'react';

export interface JournalEntryDto {
  id: number | null;
  entry_date: string; // ISO date format: YYYY-MM-DD
  content: string;
  book_id: number | null;
  created_at: string; // RFC3339 format
  updated_at: string; // RFC3339 format
}

export interface CreateJournalEntryCommand {
  entry_date: string; // ISO date format: YYYY-MM-DD
  content: string;
  book_id?: number | null;
}

export interface UpdateJournalEntryCommand {
  id: number;
  entry_date: string; // ISO date format: YYYY-MM-DD
  content: string;
  book_id?: number | null;
}

export function useJournalEntries(
  bookId?: number | null,
  startDate?: string | null,
  endDate?: string | null
) {
  const [entries, setEntries] = useState<JournalEntryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEntries();
  }, [bookId, startDate, endDate]);

  const loadEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await invoke<JournalEntryDto[]>('list_journal_entries', {
        book_id: bookId ?? null,
        start_date: startDate ?? null,
        end_date: endDate ?? null,
      });
      setEntries(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load journal entries');
    } finally {
      setLoading(false);
    }
  };

  return { entries, loading, error, refresh: loadEntries };
}

export function useJournalEntry(id: number | null) {
  const [entry, setEntry] = useState<JournalEntryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadEntry();
    } else {
      setEntry(null);
      setLoading(false);
    }
  }, [id]);

  const loadEntry = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await invoke<JournalEntryDto>('get_journal_entry', { id });
      setEntry(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load journal entry');
    } finally {
      setLoading(false);
    }
  };

  return { entry, loading, error, refresh: loadEntry };
}

export async function createJournalEntry(
  command: CreateJournalEntryCommand
): Promise<JournalEntryDto> {
  return await invoke<JournalEntryDto>('create_journal_entry', { command });
}

export async function updateJournalEntry(
  command: UpdateJournalEntryCommand
): Promise<JournalEntryDto> {
  return await invoke<JournalEntryDto>('update_journal_entry', { command });
}

export async function deleteJournalEntry(id: number): Promise<void> {
  return await invoke<void>('delete_journal_entry', { id });
}

