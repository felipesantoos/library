import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';

export interface BookSummaryDto {
  book_id: number;
  book_title: string;
  book_author: string | null;
  total_notes: number;
  total_highlights: number;
  notes_summary: string;
  highlights_text: string[];
  key_themes: string[];
  generated_at: string;
}

export function useBookSummary(bookId: number | null) {
  const [summary, setSummary] = useState<BookSummaryDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookId) {
      setSummary(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await invoke<BookSummaryDto>('generate_book_summary', { bookId });
        if (!cancelled) {
          setSummary(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to generate summary');
          setSummary(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadSummary();

    return () => {
      cancelled = true;
    };
  }, [bookId]);

  const refresh = useCallback(async () => {
    if (!bookId) {
      setSummary(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await invoke<BookSummaryDto>('generate_book_summary', { bookId });
      setSummary(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate summary');
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  return { summary, loading, error, refresh };
}

