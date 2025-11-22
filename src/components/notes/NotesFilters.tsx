import { Section, Stack } from '@/components/ui/layout';
import { HandDrawnDropdown } from '@/components/ui/inputs';
import { BookDto } from '@/hooks/useBooks';

interface NotesFiltersProps {
  typeFilter: 'all' | 'note' | 'highlight';
  sentimentFilter: 'all' | 'inspiration' | 'doubt' | 'reflection' | 'learning';
  bookFilter: number | null;
  books: BookDto[];
  onTypeFilterChange: (value: 'all' | 'note' | 'highlight') => void;
  onSentimentFilterChange: (value: 'all' | 'inspiration' | 'doubt' | 'reflection' | 'learning') => void;
  onBookFilterChange: (value: number | null) => void;
}

export function NotesFilters({
  typeFilter,
  sentimentFilter,
  bookFilter,
  books,
  onTypeFilterChange,
  onSentimentFilterChange,
  onBookFilterChange,
}: NotesFiltersProps) {
  return (
    <Section padding="sm">
      <Stack direction="row" spacing="md" className="flex-wrap">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Type
          </label>
          <HandDrawnDropdown
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'note', label: 'Notes' },
              { value: 'highlight', label: 'Highlights' },
            ]}
            value={typeFilter}
            onChange={(value) => onTypeFilterChange(value ? (value as 'all' | 'note' | 'highlight') : 'all')}
            placeholder="All Types"
            borderRadius={6}
            strokeWidth={1}
          />
        </div>

        <div className="flex-1 min-w-[180px]">
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Sentiment
          </label>
          <HandDrawnDropdown
            options={[
              { value: 'all', label: 'All Sentiments' },
              { value: 'inspiration', label: 'Inspiration' },
              { value: 'doubt', label: 'Doubt' },
              { value: 'reflection', label: 'Reflection' },
              { value: 'learning', label: 'Learning' },
            ]}
            value={sentimentFilter}
            onChange={(value) => onSentimentFilterChange(value ? (value as 'all' | 'inspiration' | 'doubt' | 'reflection' | 'learning') : 'all')}
            placeholder="All Sentiments"
            borderRadius={6}
            strokeWidth={1}
          />
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Book
          </label>
          <HandDrawnDropdown
            options={[
              { value: 0, label: 'All Books' },
              ...books.map((book) => ({
                value: book.id || 0,
                label: book.title,
              })),
            ]}
            value={bookFilter || 0}
            onChange={(value) => {
              const numValue = value ? (typeof value === 'number' ? value : parseInt(value as string)) : 0;
              onBookFilterChange(numValue === 0 ? null : numValue);
            }}
            placeholder="All Books"
            searchable={books.length > 5}
            borderRadius={6}
            strokeWidth={1}
          />
        </div>
      </Stack>
    </Section>
  );
}

