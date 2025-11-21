import React, { useState, useEffect } from 'react';
import { useTags, TagDto, createTag, CreateTagCommand } from '@/hooks/useTags';
import { Tag } from './Tag';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { useTheme } from '@/theme/ThemeProvider';

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
  const { theme } = useTheme();
  const { tags, refresh } = useTags(bookId);
  const [isOpen, setIsOpen] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState<string>('');
  const [creating, setCreating] = useState(false);
  
  // Get background color based on theme
  const backgroundColor = theme === 'dark' ? '#1A1410' : '#F8F3E8';

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
      <HandDrawnBox
        borderRadius={8}
        strokeWidth={1}
        linearCorners={true}
        className="flex flex-wrap gap-2 min-h-[2.5rem] p-2 rounded-md bg-background-surface"
      >
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
          className="ml-auto flex items-center gap-1 px-2 py-1 text-sm text-text-secondary hover:text-accent-primary hover:bg-accent-primary/10 rounded-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-in-out"
        >
          <Plus className="w-4 h-4" />
          <span>Add tag</span>
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
            <form onSubmit={handleCreateTag} className="pt-1 mt-1">
              <div className="text-sm font-medium text-text-secondary mb-2 px-2">Create new tag</div>
              <div className="space-y-2">
                <HandDrawnBox
                  borderRadius={6}
                  strokeWidth={1}
                  linearCorners={true}
                  className="w-full"
                >
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Tag name"
                    className="w-full px-2 py-1 text-sm rounded-md bg-background-surface text-text-primary focus:outline-none"
                  disabled={creating}
                />
                </HandDrawnBox>
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8" style={{ backgroundColor: newTagColor || '#000000' }}>
                    <HandDrawnBox
                      borderRadius={6}
                      strokeWidth={1.5}
                      linearCorners={true}
                      className="absolute inset-0 pointer-events-none"
                      style={{ zIndex: 10 }}
                    >
                      <div />
                    </HandDrawnBox>
                    <input
                      type="color"
                      value={newTagColor || '#000000'}
                      onChange={(e) => setNewTagColor(e.target.value)}
                      className="w-full h-full cursor-pointer opacity-0 absolute inset-0"
                      style={{ zIndex: 20 }}
                      disabled={creating}
                    />
                  </div>
                  <div className="flex gap-1 flex-1 flex-wrap">
                    {predefinedColors.map((color) => {
                      const isSelected = newTagColor === color;
                      return (
                        <div
                          key={color}
                          className={cn(
                            "relative w-6 h-6 hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out cursor-pointer"
                          )}
                          style={{ backgroundColor: color }}
                          onClick={() => !creating && setNewTagColor(color)}
                        >
                          <HandDrawnBox
                            borderRadius={6}
                            strokeWidth={isSelected ? 3 : 1.5}
                            linearCorners={true}
                            color="#000000"
                            className="absolute inset-0 pointer-events-none"
                            style={{ zIndex: 10 }}
                          >
                            <div />
                          </HandDrawnBox>
                        </div>
                      );
                    })}
                    {newTagColor && (
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center hover:bg-background-surface hover:scale-110 active:scale-95 transition-all duration-200 ease-in-out cursor-pointer"
                        onClick={() => !creating && setNewTagColor('')}
                      >
                        <X className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!newTagName.trim() || creating}
                  className="w-full px-3 py-1.5 text-sm rounded-md bg-accent-primary text-dark-text-primary hover:bg-accent-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {creating ? 'Creating...' : 'Create Tag'}
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

