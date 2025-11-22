import { useState, useEffect } from 'react';
import { JournalEntryDto, CreateJournalEntryCommand, UpdateJournalEntryCommand } from '@/hooks/useJournalEntries';
import { BookDto } from '@/hooks/useBooks';
import { Section, Stack } from '@/components/ui/layout';
import { Button } from '@/components/ui/Button';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { HandDrawnDropdown } from '@/components/ui/inputs';
import { Plus } from 'lucide-react';

interface JournalEntryFormProps {
  entry: JournalEntryDto | null;
  books: BookDto[];
  onSubmit: (command: CreateJournalEntryCommand | UpdateJournalEntryCommand) => void;
  onCancel: () => void;
}

export function JournalEntryForm({ entry, books, onSubmit, onCancel }: JournalEntryFormProps) {
  const today = new Date().toISOString().split('T')[0];
  
  const [entryDate, setEntryDate] = useState(entry?.entry_date || today);
  const [content, setContent] = useState(entry?.content || '');
  const [bookId, setBookId] = useState<number | null>(entry?.book_id || null);

  useEffect(() => {
    if (entry) {
      setEntryDate(entry.entry_date || today);
      setContent(entry.content || '');
      setBookId(entry.book_id || null);
    } else {
      setEntryDate(today);
      setContent('');
      setBookId(null);
    }
  }, [entry, today]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (entry && entry.id) {
      onSubmit({
        id: entry.id,
        entry_date: entryDate,
        content,
        book_id: bookId,
      });
    } else {
      onSubmit({
        entry_date: entryDate,
        content,
        book_id: bookId,
      });
    }
  };

  return (
    <Section padding="md" className="bg-background-surface border-2 border-accent-primary">
      <form onSubmit={handleSubmit}>
        <Stack spacing="md">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Date *
              </label>
              <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                <input
                  type="date"
                  required
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none"
                />
              </HandDrawnBox>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Book (optional)
              </label>
              <HandDrawnDropdown
                options={[
                  { value: '', label: 'No book' },
                  ...books.map((book) => ({
                    value: book.id || 0,
                    label: book.title,
                  })),
                ]}
                value={bookId || ''}
                onChange={(value) => setBookId(value ? (typeof value === 'number' ? value : parseInt(value as string)) : null)}
                placeholder="No book"
                borderRadius={6}
                strokeWidth={1}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Content *
            </label>
            <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none resize-none font-serif"
                placeholder="Write your thoughts, reflections, or insights here..."
              />
            </HandDrawnBox>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon={<Plus />}
              iconPosition="left"
            >
              {entry ? 'Update Entry' : 'Create Entry'}
            </Button>
          </div>
        </Stack>
      </form>
    </Section>
  );
}

