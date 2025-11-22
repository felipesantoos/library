import { Heading, Paragraph } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';
import { Grid, List } from 'lucide-react';

export type ViewMode = 'grid' | 'list';

interface LibraryHeaderProps {
  bookCount: number;
  hasActiveFilters: boolean;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function LibraryHeader({
  bookCount,
  hasActiveFilters,
  viewMode,
  onViewModeChange,
}: LibraryHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Heading level={1}>The Grand Bookshelf</Heading>
        <Paragraph variant="secondary" className="mt-2">
          {bookCount} {bookCount === 1 ? 'book' : 'books'} in your library
          {hasActiveFilters && (
            <span className="ml-2 text-accent-primary">
              (filtered)
            </span>
          )}
        </Paragraph>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          onClick={() => onViewModeChange('grid')}
          variant={viewMode === 'grid' ? 'primary' : 'ghost'}
          size="sm"
          iconOnly
          icon={<Grid className="w-5 h-5" />}
          aria-label="Grid view"
        />
        <Button
          onClick={() => onViewModeChange('list')}
          variant={viewMode === 'list' ? 'primary' : 'ghost'}
          size="sm"
          iconOnly
          icon={<List className="w-5 h-5" />}
          aria-label="List view"
        />
      </div>
    </div>
  );
}

