import { BookDto } from '@/hooks/useBooks';
import { Section, Stack } from '@/components/ui/layout';
import { HandDrawnDropdown } from '@/components/ui/inputs';

export type DateFilter = 'all' | 'today' | 'week' | 'month';

interface SessionsFiltersProps {
  books: BookDto[];
  bookFilter: number | null;
  dateFilter: DateFilter;
  onBookFilterChange: (value: number | null) => void;
  onDateFilterChange: (value: DateFilter) => void;
}

export function SessionsFilters({
  books,
  bookFilter,
  dateFilter,
  onBookFilterChange,
  onDateFilterChange,
}: SessionsFiltersProps) {
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

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Date Range
          </label>
          <HandDrawnDropdown
            options={[
              { value: 'all', label: 'All Time' },
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'Last 7 Days' },
              { value: 'month', label: 'Last 30 Days' },
            ]}
            value={dateFilter}
            onChange={(value) => onDateFilterChange(value ? (value as DateFilter) : 'all')}
            placeholder="All Time"
            borderRadius={6}
            strokeWidth={1}
          />
        </div>
      </Stack>
    </Section>
  );
}

