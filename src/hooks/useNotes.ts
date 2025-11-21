import { invoke } from '@tauri-apps/api/core';
import { useState, useEffect } from 'react';

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

  useEffect(() => {
    loadNotes();
  }, [filters]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await invoke<NoteDto[]>('list_notes', {
        book_id: filters?.book_id ?? null,
        note_type: filters?.note_type ?? null,
        sentiment: filters?.sentiment ?? null,
        search_query: filters?.search_query ?? null,
      });
      setNotes(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  return { notes, loading, error, refresh: loadNotes };
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
    loadNote(id);
  }, [id]);

  const loadNote = async (noteId: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await invoke<NoteDto>('get_note', { id: noteId });
      setNote(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load note');
    } finally {
      setLoading(false);
    }
  };

  return { note, loading, error, refresh: () => id !== null && loadNote(id) };
}

export async function createNote(command: CreateNoteCommand): Promise<NoteDto> {
  return await invoke<NoteDto>('create_note', { command });
}

export async function deleteNote(id: number): Promise<void> {
  return await invoke<void>('delete_note', { id });
}

