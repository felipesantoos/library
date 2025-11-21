import { TagSelector } from '@/components/ui/tags';
import { CollectionSelector } from '@/components/ui/collections';

interface BookFormTagsAndCollectionsProps {
  selectedTagIds: number[];
  selectedCollectionIds: number[];
  onTagIdsChange: (ids: number[]) => void;
  onCollectionIdsChange: (ids: number[]) => void;
  bookId?: number;
}

export function BookFormTagsAndCollections({
  selectedTagIds,
  selectedCollectionIds,
  onTagIdsChange,
  onCollectionIdsChange,
  bookId,
}: BookFormTagsAndCollectionsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">
          Tags
        </label>
        <TagSelector
          selectedTagIds={selectedTagIds}
          onSelectionChange={onTagIdsChange}
          bookId={bookId}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">
          Collections
        </label>
        <CollectionSelector
          selectedCollectionIds={selectedCollectionIds}
          onSelectionChange={onCollectionIdsChange}
          bookId={bookId}
        />
      </div>
    </div>
  );
}

