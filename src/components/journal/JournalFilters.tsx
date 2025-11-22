import { Section, Stack } from '@/components/ui/layout';
import { Button } from '@/components/ui/Button';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { HandDrawnDropdown } from '@/components/ui/inputs';
import { BookDto } from '@/hooks/useBooks';
import { X } from 'lucide-react';

interface JournalFiltersProps {
  books: BookDto[];
  bookFilter: number | null;
  startDate: string | null;
  endDate: string | null;
  onBookFilterChange: (value: number | null) => void;
  onStartDateChange: (value: string | null) => void;
  onEndDateChange: (value: string | null) => void;
  onClearFilters: () => void;
}

export function JournalFilters({
  books,
  bookFilter,
  startDate,
  endDate,
  onBookFilterChange,
  onStartDateChange,
  onEndDateChange,
  onClearFilters,
}: JournalFiltersProps) {
  const hasFilters = bookFilter !== null || startDate !== null || endDate !== null;

  return (
    <Section padding="sm">
      <Stack direction="row" spacing="md" className="flex-wrap items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Book
          </label>
          <HandDrawnDropdown
            options={[
              { value: '', label: 'All Books' },
              ...books.map((book) => ({
                value: book.id || 0,
                label: book.title,
              })),
            ]}
            value={bookFilter || ''}
            onChange={(value) => onBookFilterChange(value ? (typeof value === 'number' ? value : parseInt(value as string)) : null)}
            placeholder="All Books"
            borderRadius={6}
            strokeWidth={1}
          />
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Start Date
          </label>
          <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
            <input
              type="date"
              value={startDate || ''}
              onChange={(e) => onStartDateChange(e.target.value || null)}
              className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none"
            />
          </HandDrawnBox>
        </div>

        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-text-secondary mb-1">
            End Date
          </label>
          <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
            <input
              type="date"
              value={endDate || ''}
              onChange={(e) => onEndDateChange(e.target.value || null)}
              className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none"
            />
          </HandDrawnBox>
        </div>

        {hasFilters && (
          <Button
            onClick={onClearFilters}
            variant="outline"
            icon={<X />}
            iconPosition="left"
          >
            Clear Filters
          </Button>
        )}
      </Stack>
    </Section>
  );
}

