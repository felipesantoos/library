import { useState } from 'react';
import { useBooks } from '@/hooks/useBooks';
import { useTags } from '@/hooks/useTags';
import { useCollections } from '@/hooks/useCollections';
import { Container, Stack } from '@/components/ui/layout';
import { Paragraph } from '@/components/ui/typography';
import {
  LibraryHeader,
  LibrarySearch,
  LibraryFilters,
  BooksGrid,
  EmptyLibraryState,
  useLibraryFilters,
  ViewMode,
} from '@/components/library';

export function LibraryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [tagFilter, setTagFilter] = useState<number | null>(null);
  const [collectionFilter, setCollectionFilter] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const { tags } = useTags();
  const { collections } = useCollections();
  const { books: allBooks, loading, error } = useBooks({
    is_archived: false,
    is_wishlist: false,
  });

  const books = useLibraryFilters({
    books: allBooks,
    statusFilter,
    typeFilter,
    searchQuery,
  });

  const clearFilters = () => {
    setStatusFilter('');
    setTypeFilter('');
    setTagFilter(null);
    setCollectionFilter(null);
    setSearchQuery('');
  };

  const hasActiveFilters = !!(statusFilter || typeFilter || tagFilter || collectionFilter || searchQuery);

  if (loading) {
    return (
      <Container>
        <div className="py-8">
          <Paragraph>Loading books...</Paragraph>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="py-8">
          <Paragraph variant="secondary" className="text-semantic-error">
            Error: {error}
          </Paragraph>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <Stack spacing="lg">
          <LibraryHeader
            bookCount={books.length}
            hasActiveFilters={hasActiveFilters}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          <LibrarySearch
            value={searchQuery}
            onChange={setSearchQuery}
          />

          <LibraryFilters
            statusFilter={statusFilter}
            typeFilter={typeFilter}
            tagFilter={tagFilter}
            collectionFilter={collectionFilter}
            tags={tags}
            collections={collections}
            onStatusFilterChange={setStatusFilter}
            onTypeFilterChange={setTypeFilter}
            onTagFilterChange={setTagFilter}
            onCollectionFilterChange={setCollectionFilter}
            onClearFilters={clearFilters}
          />

          {books.length === 0 ? (
            <EmptyLibraryState
              hasActiveFilters={hasActiveFilters}
              onClearFilters={clearFilters}
            />
          ) : (
            <BooksGrid
              books={books}
              viewMode={viewMode}
              tagFilter={tagFilter}
              collectionFilter={collectionFilter}
            />
          )}
        </Stack>
      </div>
    </Container>
  );
}
