import React, { useState } from 'react';
import { useCollections, CollectionDto, createCollection, CreateCollectionCommand } from '@/hooks/useCollections';
import { cn } from '@/lib/utils';
import { Plus, FolderKanban, X } from 'lucide-react';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { useTheme } from '@/theme/ThemeProvider';

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
  const { theme } = useTheme();
  const { collections, refresh } = useCollections(bookId);
  const [isOpen, setIsOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDescription, setNewCollectionDescription] = useState('');
  const [creating, setCreating] = useState(false);
  
  // Get background color based on theme
  const backgroundColor = theme === 'dark' ? '#1A1410' : '#F8F3E8';

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
      <HandDrawnBox
        borderRadius={8}
        strokeWidth={1}
        linearCorners={true}
        className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 rounded-md bg-background-surface"
      >
        {selectedCollections.length === 0 && (
          <span className="text-text-secondary text-sm py-1">
            No collections selected
          </span>
        )}
        {selectedCollections.map((collection) => (
          <HandDrawnBox
            key={collection.id}
            borderRadius={6}
            strokeWidth={1}
            linearCorners={true}
            color="hsl(var(--accent-primary) / 0.3)"
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-accent-primary/20 text-accent-primary"
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
          </HandDrawnBox>
        ))}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="ml-auto flex items-center gap-1 px-2 py-1 text-sm text-text-secondary hover:text-accent-primary hover:bg-accent-primary/10 rounded-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-in-out"
        >
          <Plus className="w-4 h-4" />
          <span>Add collection</span>
        </button>
      </HandDrawnBox>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute z-10 mt-2 w-full shadow-lg"
        >
          <div
            className="relative"
            style={{
              backgroundColor: backgroundColor,
            }}
          >
            <HandDrawnBox
              borderRadius={8}
              strokeWidth={1}
              linearCorners={true}
              className="w-full"
            >
              <div className="p-2 max-h-64 overflow-y-auto">
            {/* Available Collections */}
            {availableCollections.length > 0 && (
              <div className="mb-2">
                <div className="text-xs text-text-secondary mb-1 px-2">Existing collections</div>
                <div className="flex flex-wrap gap-1">
                  {availableCollections.map((collection) => (
                    <HandDrawnBox
                      key={collection.id}
                      borderRadius={6}
                      strokeWidth={1}
                      linearCorners={true}
                      className="flex items-center gap-1 px-2 py-1 rounded-md bg-background-surface text-text-primary hover:bg-accent-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-in-out text-sm cursor-pointer"
                      onClick={() => handleToggleCollection(collection.id!)}
                    >
                      <FolderKanban className="w-3 h-3" />
                      <span>{collection.name}</span>
                    </HandDrawnBox>
                  ))}
                </div>
              </div>
            )}

            {/* Create New Collection */}
            <form onSubmit={handleCreateCollection} className="pt-1 mt-1">
              <div className="text-sm font-medium text-text-secondary mb-2 px-2">Create new collection</div>
              <div className="space-y-2">
                <HandDrawnBox
                  borderRadius={6}
                  strokeWidth={1}
                  linearCorners={true}
                  className="w-full"
                >
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="Collection name"
                    className="w-full px-2 py-1 text-sm rounded-md bg-background-surface text-text-primary focus:outline-none"
                  disabled={creating}
                />
                </HandDrawnBox>
                <HandDrawnBox
                  borderRadius={6}
                  strokeWidth={1}
                  linearCorners={true}
                  className="w-full"
                >
                <textarea
                  value={newCollectionDescription}
                  onChange={(e) => setNewCollectionDescription(e.target.value)}
                  placeholder="Optional description"
                  rows={2}
                    className="w-full px-2 py-1 text-sm rounded-md bg-background-surface text-text-primary focus:outline-none resize-none"
                  disabled={creating}
                />
                </HandDrawnBox>
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
            </HandDrawnBox>
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

