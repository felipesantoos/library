import { useState } from 'react';
import { CreateNoteCommand } from '@/hooks/useNotes';
import { BookDto } from '@/hooks/useBooks';
import { Section, Stack } from '@/components/ui/layout';
import { Button } from '@/components/ui/Button';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { HandDrawnDropdown } from '@/components/ui/inputs';
import { SentimentBadge } from '@/components/ui/notes/SentimentBadge';

interface NoteFormProps {
  books: BookDto[];
  onSubmit: (command: CreateNoteCommand) => void;
  onCancel: () => void;
}

export function NoteForm({ books, onSubmit, onCancel }: NoteFormProps) {
  const [bookId, setBookId] = useState<number | null>(null);
  const [noteType, setNoteType] = useState<'note' | 'highlight'>('note');
  const [page, setPage] = useState<number | null>(null);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [sentiment, setSentiment] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookId || !content.trim()) {
      alert('Please select a book and enter note content');
      return;
    }

    if (noteType === 'highlight' && !excerpt.trim()) {
      alert('Highlight excerpt is required');
      return;
    }

    onSubmit({
      book_id: bookId,
      note_type: noteType,
      page: page || null,
      excerpt: noteType === 'highlight' ? excerpt : null,
      content: content.trim(),
      sentiment: sentiment ? (sentiment as any) : null,
    });

    // Reset form
    setBookId(null);
    setNoteType('note');
    setPage(null);
    setExcerpt('');
    setContent('');
    setSentiment('');
  };

  return (
    <Section padding="md" className="bg-background-surface border-2 border-accent-primary">
      <form onSubmit={handleSubmit}>
        <Stack spacing="md">
          <div className="grid grid-cols-2 gap-4">
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
                Type *
              </label>
              <HandDrawnDropdown
                options={[
                  { value: 'note', label: 'Note' },
                  { value: 'highlight', label: 'Highlight' },
                ]}
                value={noteType}
                onChange={(value) => setNoteType(value as 'note' | 'highlight')}
                placeholder="Select type..."
                borderRadius={6}
                strokeWidth={1}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                Sentiment (optional)
              </label>
              <div className="flex items-center gap-2">
                <HandDrawnDropdown
                  options={[
                    { value: '', label: 'None' },
                    { value: 'inspiration', label: 'Inspiration' },
                    { value: 'doubt', label: 'Doubt' },
                    { value: 'reflection', label: 'Reflection' },
                    { value: 'learning', label: 'Learning' },
                  ]}
                  value={sentiment}
                  onChange={(value) => setSentiment(value ? String(value) : '')}
                  placeholder="None"
                  borderRadius={6}
                  strokeWidth={1}
                  className="flex-1"
                />
                {sentiment && (
                  <SentimentBadge sentiment={sentiment as any} size="md" variant="outline" />
                )}
              </div>
            </div>
          </div>

          {noteType === 'highlight' && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Excerpt *
              </label>
              <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                <textarea
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none resize-none"
                  placeholder="Selected text..."
                />
              </HandDrawnBox>
            </div>
          )}

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

