import { Section, Stack } from '@/components/ui/layout';
import { HandDrawnDropdown } from '@/components/ui/inputs';
import { BookDto } from '@/hooks/useBooks';

interface NotesFiltersProps {
  bookFilter: number | null;
  books: BookDto[];
  onBookFilterChange: (value: number | null) => void;
}

export function NotesFilters({
  bookFilter,
  books,
  onBookFilterChange,
}: NotesFiltersProps) {
  return (
    <Section padding="sm">
      <Stack direction="row" spacing="md" className="flex-wrap">
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

