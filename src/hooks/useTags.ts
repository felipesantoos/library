import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

export interface TagDto {
  id?: number;
  name: string;
  color?: string | null;
  created_at: string;
}

export interface CreateTagCommand {
  name: string;
  color?: string | null;
}

export interface AddTagsToBookCommand {
  book_id: number;
  tag_ids: number[];
}

export function useTags(bookId?: number) {
  const [tags, setTags] = useState<TagDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listTags(bookId);
      setTags(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tags');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [bookId]);

  return { tags, loading, error, refresh };
}

export async function listTags(bookId?: number): Promise<TagDto[]> {
  return await invoke<TagDto[]>('list_tags', { bookId });
}

export async function createTag(command: CreateTagCommand): Promise<TagDto> {
  return await invoke<TagDto>('create_tag', { command });
}

export async function deleteTag(id: number): Promise<void> {
  return await invoke<void>('delete_tag', { id });
}

export async function addTagsToBook(command: AddTagsToBookCommand): Promise<void> {
  return await invoke<void>('add_tags_to_book', { command });
}

export async function removeTagFromBook(bookId: number, tagId: number): Promise<void> {
  return await invoke<void>('remove_tag_from_book', { bookId, tagId });
}

