import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooks, BookDto } from '@/hooks/useBooks';
import { useTags } from '@/hooks/useTags';
import { useCollections } from '@/hooks/useCollections';
import { Container, Stack, Section } from '@/components/ui/layout';
import { Heading, Paragraph } from '@/components/ui/typography';
import { ProgressBar } from '@/components/ui/data-display';
import { Tag } from '@/components/ui/tags';
import { BookOpen, Grid, List, FolderKanban, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'grid' | 'list';

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
  });

  // Filter books client-side based on basic filters (status, type, search)
  const books = useMemo(() => {
    let filtered = [...allBooks];

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter((book) => book.status === statusFilter);
    }

    // Type filter
    if (typeFilter) {
      filtered = filtered.filter((book) => book.book_type === typeFilter);
    }

    // Search filter (title, author)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          (book.author && book.author.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [allBooks, statusFilter, typeFilter, searchQuery]);

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter('');
    setTypeFilter('');
    setTagFilter(null);
    setCollectionFilter(null);
    setSearchQuery('');
  };

  const hasActiveFilters = statusFilter || typeFilter || tagFilter || collectionFilter || searchQuery;

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
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <Heading level={1}>The Grand Bookshelf</Heading>
              <Paragraph variant="secondary" className="mt-2">
                {books.length} {books.length === 1 ? 'book' : 'books'} in your library
                {hasActiveFilters && (
                  <span className="ml-2 text-accent-primary">
                    (filtered)
                  </span>
                )}
              </Paragraph>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'grid'
                    ? 'bg-accent-primary text-dark-text-primary'
                    : 'bg-background-surface hover:bg-background-surface/80 text-text-secondary'
                )}
                aria-label="Grid view"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-md transition-colors',
                  viewMode === 'list'
                    ? 'bg-accent-primary text-dark-text-primary'
                    : 'bg-background-surface hover:bg-background-surface/80 text-text-secondary'
                )}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search */}
          <Section padding="sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or author..."
                className="w-full pl-10 pr-10 py-2 rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-text-secondary hover:text-text-primary transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </Section>

          {/* Filters */}
          <Section padding="sm">
            <Stack direction="row" spacing="md" className="flex-wrap">
              <div className="flex-1 min-w-[180px]">
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                >
                  <option value="">All</option>
                  <option value="not_started">Not Started</option>
                  <option value="reading">Reading</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                  <option value="abandoned">Abandoned</option>
                </select>
              </div>

              <div className="flex-1 min-w-[180px]">
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                >
                  <option value="">All</option>
                  <option value="physical_book">Physical Book</option>
                  <option value="ebook">Ebook</option>
                  <option value="audiobook">Audiobook</option>
                  <option value="article">Article</option>
                  <option value="PDF">PDF</option>
                  <option value="comic">Comic</option>
                </select>
              </div>

              <div className="flex-1 min-w-[180px]">
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Tag
                </label>
                <select
                  value={tagFilter || ''}
                  onChange={(e) => setTagFilter(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                >
                  <option value="">All Tags</option>
                  {tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                      {tag.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[180px]">
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Collection
                </label>
                <select
                  value={collectionFilter || ''}
                  onChange={(e) => setCollectionFilter(e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-3 py-2 rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                >
                  <option value="">All Collections</option>
                  {collections.map((collection) => (
                    <option key={collection.id} value={collection.id}>
                      {collection.name}
                    </option>
                  ))}
                </select>
              </div>

              {hasActiveFilters && (
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="px-3 py-2 text-sm rounded-md border border-background-border text-text-secondary hover:bg-background-surface transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </Stack>
          </Section>

          {/* Books Display */}
          {books.length === 0 ? (
            <Section padding="lg">
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto text-text-secondary mb-4" />
                <Heading level={3}>
                  {hasActiveFilters ? 'No books match your filters' : 'Your bookshelf is empty'}
                </Heading>
                <Paragraph variant="secondary" className="mt-2">
                  {hasActiveFilters
                    ? 'Try adjusting your filters or search query'
                    : 'Add your first book to get started'}
                </Paragraph>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 rounded-md bg-accent-primary text-dark-text-primary hover:bg-accent-primary/90 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </Section>
          ) : (
            <FilteredBookList
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

function FilteredBookList({
  books,
  viewMode,
  tagFilter,
  collectionFilter,
}: {
  books: BookDto[];
  viewMode: ViewMode;
  tagFilter: number | null;
  collectionFilter: number | null;
}) {
  // Filter by tags and collections (requires fetching tags/collections for each book)
  const filteredBooks = useMemo(() => {
    if (!tagFilter && !collectionFilter) {
      return books;
    }

    // For now, we'll show all books and filter by tags/collections in the BookCard component
    // A better approach would be to fetch all tags/collections upfront and filter client-side
    // or implement server-side filtering
    return books;
  }, [books, tagFilter, collectionFilter]);

  return (
    <div
      className={cn(
        viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
      )}
    >
      {filteredBooks.map((book) => (
        <BookCard
          key={book.id ?? `book-${book.title}`}
          book={book}
          tagFilter={tagFilter}
          collectionFilter={collectionFilter}
        />
      ))}
    </div>
  );
}

function BookCard({
  book,
  onClick,
  tagFilter,
  collectionFilter,
}: {
  book: BookDto;
  onClick?: () => void;
  tagFilter?: number | null;
  collectionFilter?: number | null;
}) {
  const navigate = useNavigate();
  const { tags } = useTags(book.id || undefined);
  const { collections } = useCollections(book.id || undefined);

  // Check if book matches tag/collection filters
  const matchesTagFilter = !tagFilter || tags.some((tag) => tag.id === tagFilter);
  const matchesCollectionFilter = !collectionFilter || collections.some((c) => c.id === collectionFilter);

  // Hide book if it doesn't match filters
  if (tagFilter && !matchesTagFilter) {
    return null;
  }
  if (collectionFilter && !matchesCollectionFilter) {
    return null;
  }

  return (
    <Section
      padding="md"
      className="hover:shadow-medium hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-in-out cursor-pointer"
      onClick={() => navigate(`/book/${book.id}`)}
    >
      <Stack spacing="sm">
        {/* Cover placeholder */}
        <div className="aspect-[3/4] bg-background-surface dark:bg-dark-background-surface border border-background-border dark:border-dark-background-border rounded-md flex items-center justify-center overflow-hidden">
          {book.cover_url ? (
            <img
              src={book.cover_url}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <BookOpen className="w-12 h-12 text-text-secondary dark:text-dark-text-secondary" />
          )}
        </div>

        {/* Info */}
        <div>
          <Heading level={4} className="line-clamp-2">
            {book.title}
          </Heading>
          {book.author && (
            <Paragraph variant="secondary" className="mt-1">
              {book.author}
            </Paragraph>
          )}
        </div>

        {/* Progress */}
        {book.total_pages && book.total_pages > 0 && (
          <ProgressBar
            value={book.progress_percentage}
            label={`${book.current_page_text} / ${book.total_pages} pages`}
            size="sm"
          />
        )}
        {book.total_minutes && book.total_minutes > 0 && (
          <ProgressBar
            value={book.progress_percentage}
            label={`${book.current_minutes_audio} / ${book.total_minutes} minutes`}
            size="sm"
          />
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag) => (
              <Tag
                key={tag.id}
                name={tag.name}
                color={tag.color || undefined}
                size="sm"
                variant="ghost"
              />
            ))}
            {tags.length > 2 && (
              <Tag
                name={`+${tags.length - 2}`}
                size="sm"
                variant="ghost"
              />
            )}
          </div>
        )}

        {/* Collections */}
        {collections.length > 0 && (
          <div className="flex flex-wrap gap-1 text-xs text-text-secondary">
            {collections.slice(0, 1).map((collection) => (
              <div
                key={collection.id}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-accent-primary/10 text-accent-primary border border-accent-primary/20"
              >
                <FolderKanban className="w-3 h-3" />
                <span>{collection.name}</span>
              </div>
            ))}
            {collections.length > 1 && (
              <span className="px-1.5 py-0.5 text-text-secondary">
                +{collections.length - 1}
              </span>
            )}
          </div>
        )}

        {/* Status Badge */}
        <div>
          <span
            className={cn(
              'inline-block px-2 py-1 rounded text-xs font-medium',
              book.status === 'reading'
                ? 'bg-accent-primary/20 text-accent-primary'
                : book.status === 'completed'
                ? 'bg-semantic-success/20 text-semantic-success'
                : 'bg-text-secondary/20 text-text-secondary'
            )}
          >
            {book.status.replace('_', ' ')}
          </span>
        </div>
      </Stack>
    </Section>
  );
}
