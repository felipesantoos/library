import React, { useState } from 'react';
import { useCollections, CollectionDto, createCollection, CreateCollectionCommand } from '@/hooks/useCollections';
import { cn } from '@/lib/utils';
import { Plus, FolderKanban, X } from 'lucide-react';

interface CollectionSelectorProps {
  selectedCollectionIds: number[];
  onSelectionChange: (collectionIds: number[]) => void;
  bookId?: number; // If provided, shows collections for this book
  multiSelect?: boolean;
}

export function CollectionSelector({
  selectedCollectionIds,
  onSelectionChange,
  bookId,
  multiSelect = true,
}: CollectionSelectorProps) {
  const { collections, refresh } = useCollections(bookId);
  const [isOpen, setIsOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const selectedCollections = collections.filter((c) => c.id && selectedCollectionIds.includes(c.id));
  const availableCollections = collections.filter((c) => !c.id || !selectedCollectionIds.includes(c.id));

  const handleToggleCollection = (collectionId: number) => {
    if (selectedCollectionIds.includes(collectionId)) {
      onSelectionChange(selectedCollectionIds.filter((id) => id !== collectionId));
    } else {
      if (multiSelect) {
        onSelectionChange([...selectedCollectionIds, collectionId]);
      } else {
        onSelectionChange([collectionId]);
      }
    }
  };

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    setCreating(true);
    try {
      const command: CreateCollectionCommand = {
        name: newCollectionName.trim(),
        description: newCollectionDescription.trim() || null,
      };
      const newCollection = await createCollection(command);
      setNewCollectionName('');
      setNewCollectionDescription('');
      await refresh();
      if (newCollection.id) {
        onSelectionChange([...selectedCollectionIds, newCollection.id]);
      }
      setIsOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create collection');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="relative">
      {/* Selected Collections Display */}
      <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border border-background-border rounded-md bg-background-surface">
        {selectedCollections.length === 0 && (
          <span className="text-text-secondary text-sm py-1">
            No collections selected
          </span>
        )}
        {selectedCollections.map((collection) => (
          <div
            key={collection.id}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-accent-primary/20 text-accent-primary border border-accent-primary/30"
          >
            <FolderKanban className="w-3 h-3" />
            <span className="text-sm">{collection.name}</span>
            <button
              type="button"
              onClick={() => handleToggleCollection(collection.id!)}
              className="ml-1 hover:bg-black/15 dark:hover:bg-white/15 rounded-full p-0.5 hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out"
              aria-label={`Remove ${collection.name} collection`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="ml-auto flex items-center gap-1 px-2 py-1 text-sm text-text-secondary hover:text-accent-primary hover:bg-accent-primary/10 rounded-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-in-out"
        >
          <Plus className="w-4 h-4" />
          <span>Add collection</span>
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-background-base border border-background-border rounded-md shadow-lg max-h-64 overflow-y-auto">
          <div className="p-2">
            {/* Available Collections */}
            {availableCollections.length > 0 && (
              <div className="mb-2">
                <div className="text-xs text-text-secondary mb-1 px-2">Existing collections</div>
                <div className="flex flex-wrap gap-1">
                  {availableCollections.map((collection) => (
                    <button
                      key={collection.id}
                      type="button"
                      onClick={() => handleToggleCollection(collection.id!)}
                      className="flex items-center gap-1 px-2 py-1 rounded-md bg-background-surface border border-background-border text-text-primary hover:bg-accent-primary/10 hover:border-accent-primary hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-in-out text-sm"
                    >
                      <FolderKanban className="w-3 h-3" />
                      <span>{collection.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Create New Collection */}
            <form onSubmit={handleCreateCollection} className="border-t border-background-border pt-2 mt-2">
              <div className="text-xs text-text-secondary mb-2 px-2">Create new collection</div>
              <div className="space-y-2">
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="Collection name"
                  className="w-full px-2 py-1 text-sm rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  disabled={creating}
                />
                <textarea
                  value={newCollectionDescription}
                  onChange={(e) => setNewCollectionDescription(e.target.value)}
                  placeholder="Optional description"
                  rows={2}
                  className="w-full px-2 py-1 text-sm rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none"
                  disabled={creating}
                />
                <button
                  type="submit"
                  disabled={!newCollectionName.trim() || creating}
                  className="w-full px-3 py-1.5 text-sm rounded-md bg-accent-primary text-dark-text-primary hover:bg-accent-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {creating ? 'Creating...' : 'Create Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Backdrop to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

