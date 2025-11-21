import { invoke } from '@tauri-apps/api/core';
import { useState, useEffect, useCallback } from 'react';

export interface NoteDto {
  id: number | null;
  book_id: number;
  reading_id: number | null;
  page: number | null;
  note_type: 'note' | 'highlight';
  excerpt: string | null;
  content: string;
  sentiment: 'inspiration' | 'doubt' | 'reflection' | 'learning' | null;
  created_at: string;
  updated_at: string;
}

export interface CreateNoteCommand {
  book_id: number;
  reading_id?: number | null;
  page?: number | null;
  note_type: 'note' | 'highlight';
  excerpt?: string | null;
  content: string;
  sentiment?: 'inspiration' | 'doubt' | 'reflection' | 'learning' | null;
}

export function useNotes(filters?: {
  book_id?: number;
  note_type?: 'note' | 'highlight';
  sentiment?: 'inspiration' | 'doubt' | 'reflection' | 'learning';
  search_query?: string;
}) {
  const [notes, setNotes] = useState<NoteDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extrair valores primitivos para usar como dependências estáveis
  const bookId = filters?.book_id;
  const noteType = filters?.note_type;
  const sentiment = filters?.sentiment;
  const searchQuery = filters?.search_query;

  useEffect(() => {
    let cancelled = false;

    const loadNotes = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await invoke<NoteDto[]>('list_notes', {
          book_id: bookId ?? null,
          note_type: noteType ?? null,
          sentiment: sentiment ?? null,
          search_query: searchQuery ?? null,
        });
        if (!cancelled) {
          setNotes(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load notes');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadNotes();

    return () => {
      cancelled = true;
    };
  }, [bookId, noteType, sentiment, searchQuery]);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await invoke<NoteDto[]>('list_notes', {
        book_id: bookId ?? null,
        note_type: noteType ?? null,
        sentiment: sentiment ?? null,
        search_query: searchQuery ?? null,
      });
      setNotes(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, [bookId, noteType, sentiment, searchQuery]);

  return { notes, loading, error, refresh };
}

export function useNote(id: number | null) {
  const [note, setNote] = useState<NoteDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setNote(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadNote = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await invoke<NoteDto>('get_note', { id });
        if (!cancelled) {
          setNote(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load note');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadNote();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const refresh = useCallback(async () => {
    if (id === null) return;
    try {
      setLoading(true);
      setError(null);
      const result = await invoke<NoteDto>('get_note', { id });
      setNote(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load note');
    } finally {
      setLoading(false);
    }
  }, [id]);

  return { note, loading, error, refresh };
}

export async function createNote(command: CreateNoteCommand): Promise<NoteDto> {
  return await invoke<NoteDto>('create_note', { command });
}

export async function deleteNote(id: number): Promise<void> {
  return await invoke<void>('delete_note', { id });
}

