import { useState } from 'react';
import { CreateNoteCommand } from '@/hooks/useNotes';
import { BookDto } from '@/hooks/useBooks';
import { Section, Stack } from '@/components/ui/layout';
import { Button } from '@/components/ui/Button';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
interface NoteFormProps {
  books: BookDto[];
  onSubmit: (command: CreateNoteCommand) => void;
  onCancel: () => void;
}

export function NoteForm({ books, onSubmit, onCancel }: NoteFormProps) {
  const [bookId, setBookId] = useState<number | null>(null);
  const [page, setPage] = useState<number | null>(null);
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookId || !content.trim()) {
      alert('Please select a book and enter note content');
      return;
    }

    onSubmit({
      book_id: bookId,
      page: page || null,
      content: content.trim(),
    });

    // Reset form
    setBookId(null);
    setPage(null);
    setContent('');
  };

  return (
    <Section padding="md" className="bg-background-surface border-2 border-accent-primary">
      <form onSubmit={handleSubmit}>
        <Stack spacing="md">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Book *
            </label>
            <HandDrawnDropdown
              options={[
                { value: '', label: 'Select a book...' },
                ...books
                  .filter((b) => !b.is_archived)
                  .map((book) => ({
                    value: book.id || 0,
                    label: `${book.title}${book.author ? ` by ${book.author}` : ''}`,
                  })),
              ]}
              value={bookId || ''}
              onChange={(value) => setBookId(value ? (typeof value === 'number' ? value : parseInt(value as string)) : null)}
              placeholder="Select a book..."
              searchable={books.filter((b) => !b.is_archived).length > 5}
              borderRadius={6}
              strokeWidth={1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Page
            </label>
            <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
              <input
                type="number"
                min="0"
                value={page || ''}
                onChange={(e) => setPage(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none"
                placeholder="Optional"
              />
            </HandDrawnBox>
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
                rows={4}
                className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none resize-none"
                placeholder="Your note or comment..."
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
            >
              Save Note
            </Button>
          </div>
        </Stack>
      </form>
    </Section>
  );
}

