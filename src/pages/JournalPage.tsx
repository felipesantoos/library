import { useState } from 'react';
import { useJournalEntries, JournalEntryDto } from '@/hooks/useJournalEntries';
import { useBooks } from '@/hooks/useBooks';
import { Container, Stack, Section } from '@/components/ui/layout';
import { Paragraph } from '@/components/ui/typography';
import {
  JournalHeader,
  JournalFilters,
  JournalEntryForm,
  EmptyJournalState,
  JournalTimeline,
  useJournalEntriesByDate,
  useJournalActions,
} from '@/components/journal';

export function JournalPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntryDto | null>(null);
  const [bookFilter, setBookFilter] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const { entries, loading, error, refresh } = useJournalEntries(
    bookFilter,
    startDate,
    endDate
  );
  const { books } = useBooks();

  const entriesByDate = useJournalEntriesByDate(entries);

  const { handleCreate, handleUpdate, handleDelete } = useJournalActions(refresh);

  const handleFormSubmit = (command: any) => {
    if (editingEntry) {
      handleUpdate(command);
      setShowForm(false);
      setEditingEntry(null);
    } else {
      handleCreate(command);
      setShowForm(false);
    }
  };

  const handleEdit = (entry: JournalEntryDto) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEntry(null);
  };

  const clearFilters = () => {
    setBookFilter(null);
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <Container>
      <div className="py-8">
        <Stack spacing="lg">
          <JournalHeader onNewEntryClick={() => setShowForm(!showForm)} />

          <JournalFilters
            books={books}
            bookFilter={bookFilter}
            startDate={startDate}
            endDate={endDate}
            onBookFilterChange={setBookFilter}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onClearFilters={clearFilters}
          />

          {(showForm || editingEntry) && (
            <JournalEntryForm
              entry={editingEntry}
              books={books}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
            />
          )}

          {loading ? (
            <Section padding="lg">
              <Paragraph>Loading journal entries...</Paragraph>
            </Section>
          ) : error ? (
            <Section padding="lg">
              <Paragraph variant="secondary" className="text-semantic-error">
                Error: {error}
              </Paragraph>
            </Section>
          ) : entries.length === 0 ? (
            <EmptyJournalState />
          ) : (
            <JournalTimeline
              entriesByDate={entriesByDate}
              books={books}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </Stack>
      </div>
    </Container>
  );
}
