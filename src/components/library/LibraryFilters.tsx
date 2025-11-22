import { Section, Stack } from '@/components/ui/layout';
import { Button } from '@/components/ui/Button';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { HandDrawnDropdown } from '@/components/ui/inputs';
import { TagDto } from '@/hooks/useTags';
import { CollectionDto } from '@/hooks/useCollections';
import { X } from 'lucide-react';

interface LibraryFiltersProps {
  statusFilter: string;
  typeFilter: string;
  tagFilter: number | null;
  collectionFilter: number | null;
  tags: TagDto[];
  collections: CollectionDto[];
  onStatusFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onTagFilterChange: (value: number | null) => void;
  onCollectionFilterChange: (value: number | null) => void;
  onClearFilters: () => void;
}

export function LibraryFilters({
  statusFilter,
  typeFilter,
  tagFilter,
  collectionFilter,
  tags,
  collections,
  onStatusFilterChange,
  onTypeFilterChange,
  onTagFilterChange,
  onCollectionFilterChange,
  onClearFilters,
}: LibraryFiltersProps) {
  const hasActiveFilters = statusFilter || typeFilter || tagFilter || collectionFilter;

  return (
    <Section padding="sm">
      <Stack direction="row" spacing="md" className="flex-wrap">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Status
          </label>
          <HandDrawnDropdown
            options={[
              { value: '', label: 'All' },
              { value: 'not_started', label: 'Not Started' },
              { value: 'reading', label: 'Reading' },
              { value: 'paused', label: 'Paused' },
              { value: 'completed', label: 'Completed' },
              { value: 'abandoned', label: 'Abandoned' },
            ]}
            value={statusFilter}
            onChange={(value) => onStatusFilterChange(value ? String(value) : '')}
            placeholder="All"
            borderRadius={6}
            strokeWidth={1}
          />
        </div>

        <div className="flex-1 min-w-[180px]">
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Type
          </label>
          <HandDrawnDropdown
            options={[
              { value: '', label: 'All' },
              { value: 'physical_book', label: 'Physical Book' },
              { value: 'ebook', label: 'Ebook' },
              { value: 'audiobook', label: 'Audiobook' },
              { value: 'article', label: 'Article' },
              { value: 'PDF', label: 'PDF' },
              { value: 'comic', label: 'Comic' },
            ]}
            value={typeFilter}
            onChange={(value) => onTypeFilterChange(value ? String(value) : '')}
            placeholder="All"
            borderRadius={6}
            strokeWidth={1}
          />
        </div>

        <div className="flex-1 min-w-[180px]">
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Tag
          </label>
          <HandDrawnDropdown
            options={[
              { value: 0, label: 'All Tags' },
              ...tags.map((tag) => ({
                value: tag.id || 0,
                label: tag.name,
              })),
            ]}
            value={tagFilter || 0}
            onChange={(value) => {
              const numValue = value ? (typeof value === 'number' ? value : parseInt(value as string)) : 0;
              onTagFilterChange(numValue === 0 ? null : numValue);
            }}
            placeholder="All Tags"
            searchable={tags.length > 5}
            borderRadius={6}
            strokeWidth={1}
          />
        </div>

        <div className="flex-1 min-w-[180px]">
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Collection
          </label>
          <HandDrawnDropdown
            options={[
              { value: 0, label: 'All Collections' },
              ...collections.map((collection) => ({
                value: collection.id || 0,
                label: collection.name,
              })),
            ]}
            value={collectionFilter || 0}
            onChange={(value) => {
              const numValue = value ? (typeof value === 'number' ? value : parseInt(value as string)) : 0;
              onCollectionFilterChange(numValue === 0 ? null : numValue);
            }}
            placeholder="All Collections"
            searchable={collections.length > 5}
            borderRadius={6}
            strokeWidth={1}
          />
        </div>

        {hasActiveFilters && (
          <div className="flex items-end">
            <Button
              onClick={onClearFilters}
              variant="outline"
              icon={<X />}
              iconPosition="left"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </Stack>
    </Section>
  );
}

