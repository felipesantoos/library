import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';

export interface CollectionDto {
  id?: number;
  name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCollectionCommand {
  name: string;
  description?: string | null;
}

export interface UpdateCollectionCommand {
  id: number;
  name?: string;
  description?: string | null;
}

export interface AddBooksToCollectionCommand {
  collection_id: number;
  book_ids: number[];
}

export function useCollections(bookId?: number) {
  const [collections, setCollections] = useState<CollectionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await listCollections(bookId);
      setCollections(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load collections');
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { collections, loading, error, refresh };
}

export async function listCollections(bookId?: number): Promise<CollectionDto[]> {
  return await invoke<CollectionDto[]>('list_collections', { bookId });
}

export async function createCollection(command: CreateCollectionCommand): Promise<CollectionDto> {
  return await invoke<CollectionDto>('create_collection', { command });
}

export async function updateCollection(command: UpdateCollectionCommand): Promise<CollectionDto> {
  return await invoke<CollectionDto>('update_collection', { command });
}

export async function deleteCollection(id: number): Promise<void> {
  return await invoke<void>('delete_collection', { id });
}

export async function addBooksToCollection(command: AddBooksToCollectionCommand): Promise<void> {
  return await invoke<void>('add_books_to_collection', { command });
}

export async function removeBookFromCollection(bookId: number, collectionId: number): Promise<void> {
  return await invoke<void>('remove_book_from_collection', { bookId, collectionId });
}

