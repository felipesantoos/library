import React, { useState, useEffect } from 'react';
import { useTags, TagDto, createTag, CreateTagCommand } from '@/hooks/useTags';
import { Tag } from './Tag';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagSelectorProps {
  selectedTagIds: number[];
  onSelectionChange: (tagIds: number[]) => void;
  bookId?: number; // If provided, shows tags for this book
}

export function TagSelector({
  selectedTagIds,
  onSelectionChange,
  bookId,
}: TagSelectorProps) {
  const { tags, refresh } = useTags(bookId);
  const [isOpen, setIsOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState<string>('');
  const [creating, setCreating] = useState(false);

  const selectedTags = tags.filter((tag) => tag.id && selectedTagIds.includes(tag.id));
  const availableTags = tags.filter((tag) => !tag.id || !selectedTagIds.includes(tag.id));

  const handleToggleTag = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      onSelectionChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onSelectionChange([...selectedTagIds, tagId]);
    }
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    setCreating(true);
    try {
      const command: CreateTagCommand = {
        name: newTagName.trim(),
        color: newTagColor || null,
      };
      const newTag = await createTag(command);
      setNewTagName('');
      setNewTagColor('');
      await refresh();
      if (newTag.id) {
        onSelectionChange([...selectedTagIds, newTag.id]);
      }
      setIsOpen(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create tag');
    } finally {
      setCreating(false);
    }
  };

  const predefinedColors = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33F5', '#F5FF33',
    '#FF8C33', '#33FFB8', '#B833FF', '#FF3380', '#80FF33',
  ];

  return (
    <div className="relative">
      {/* Selected Tags Display */}
      <div className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 border border-background-border rounded-md bg-background-surface">
        {selectedTags.length === 0 && (
          <span className="text-text-secondary text-sm py-1">
            No tags selected
          </span>
        )}
        {selectedTags.map((tag) => (
          <Tag
            key={tag.id}
            name={tag.name}
            color={tag.color || undefined}
            size="sm"
            onRemove={() => handleToggleTag(tag.id!)}
          />
        ))}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="ml-auto flex items-center gap-1 px-2 py-1 text-sm text-text-secondary hover:text-accent-primary transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add tag</span>
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-background-base border border-background-border rounded-md shadow-lg max-h-64 overflow-y-auto">
          <div className="p-2">
            {/* Available Tags */}
            {availableTags.length > 0 && (
              <div className="mb-2">
                <div className="text-xs text-text-secondary mb-1 px-2">Existing tags</div>
                <div className="flex flex-wrap gap-1">
                  {availableTags.map((tag) => (
                    <Tag
                      key={tag.id}
                      name={tag.name}
                      color={tag.color || undefined}
                      size="sm"
                      onClick={() => handleToggleTag(tag.id!)}
                      variant="outline"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Create New Tag */}
            <form onSubmit={handleCreateTag} className="border-t border-background-border pt-2 mt-2">
              <div className="text-xs text-text-secondary mb-2 px-2">Create new tag</div>
              <div className="space-y-2">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Tag name"
                  className="w-full px-2 py-1 text-sm rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  disabled={creating}
                />
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newTagColor || '#000000'}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    className="w-8 h-8 rounded border border-background-border cursor-pointer"
                    disabled={creating}
                  />
                  <div className="flex gap-1 flex-1 flex-wrap">
                    {predefinedColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewTagColor(color)}
                        className={cn(
                          "w-6 h-6 rounded border border-background-border hover:scale-110 transition-transform",
                          newTagColor === color && "ring-2 ring-accent-primary"
                        )}
                        style={{ backgroundColor: color }}
                        disabled={creating}
                      />
                    ))}
                    {newTagColor && (
                      <button
                        type="button"
                        onClick={() => setNewTagColor('')}
                        className="w-6 h-6 rounded border border-background-border flex items-center justify-center hover:bg-background-surface transition-colors"
                        disabled={creating}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!newTagName.trim() || creating}
                  className="w-full px-3 py-1.5 text-sm rounded-md bg-accent-primary text-white hover:bg-accent-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? 'Creating...' : 'Create Tag'}
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

