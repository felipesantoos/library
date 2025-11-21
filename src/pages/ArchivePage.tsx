import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooks, updateBook, BookDto } from '@/hooks/useBooks';
import { Container, Stack, Section } from '@/components/ui/layout';
import { Heading, Paragraph, MetaText } from '@/components/ui/typography';
import { ProgressBar } from '@/components/ui/data-display';
import { BookOpen, Archive, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ArchivePage() {
  const navigate = useNavigate();
  const { books, loading, error, refresh } = useBooks({
    is_archived: true,
  });

  const handleRestore = async (book: BookDto) => {
    try {
      await updateBook({
        ...book,
        is_archived: false,
      });
      refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to restore book');
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="py-8">
          <Paragraph>Loading archived books...</Paragraph>
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
          <div>
            <Heading level={1}>The Dusty Archives</Heading>
            <Paragraph variant="secondary" className="mt-2">
              {books.length} {books.length === 1 ? 'book' : 'books'} archived
            </Paragraph>
          </div>

          {/* Books Grid */}
          {books.length === 0 ? (
            <Section padding="lg">
              <div className="text-center py-12">
                <Archive className="w-16 h-16 mx-auto text-text-secondary mb-4" />
                <Heading level={3}>No archived books</Heading>
                <Paragraph variant="secondary" className="mt-2">
                  Archive books you're not currently reading to keep your library organized
                </Paragraph>
              </div>
            </Section>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <ArchivedBookCard
                  key={book.id}
                  book={book}
                  onRestore={handleRestore}
                  onClick={() => navigate(`/book/${book.id}`)}
                />
              ))}
            </div>
          )}
        </Stack>
      </div>
    </Container>
  );
}

function ArchivedBookCard({
  book,
  onRestore,
  onClick,
}: {
  book: BookDto;
  onRestore: (book: BookDto) => void;
  onClick: () => void;
}) {
  return (
    <Section padding="md" className="hover:shadow-medium transition-shadow">
      <Stack spacing="sm">
        {/* Cover */}
        <div
          className="aspect-[3/4] bg-background-surface border border-background-border rounded-md flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={onClick}
        >
          {book.cover_url ? (
            <img
              src={book.cover_url}
              alt={book.title}
              className="w-full h-full object-cover opacity-75"
            />
          ) : (
            <BookOpen className="w-12 h-12 text-text-secondary" />
          )}
        </div>

        {/* Info */}
        <div onClick={onClick} className="cursor-pointer">
          <Heading level={4} className="line-clamp-2 text-base">
            {book.title}
          </Heading>
          {book.author && (
            <Paragraph variant="secondary" className="mt-1 text-sm">
              {book.author}
            </Paragraph>
          )}
        </div>

        {/* Progress */}
        {book.total_pages && book.total_pages > 0 && (
          <div className="opacity-60">
            <ProgressBar
              value={book.progress_percentage}
              label={`${book.current_page_text} / ${book.total_pages} pages`}
              size="sm"
            />
          </div>
        )}

        {/* Status */}
        <MetaText className="text-xs capitalize opacity-60">{book.status}</MetaText>

        {/* Actions */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRestore(book);
          }}
          className="flex items-center justify-center space-x-2 w-full px-3 py-2 rounded-md border border-background-border text-text-secondary hover:bg-background-surface transition-colors text-sm"
          title="Restore to library"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Restore</span>
        </button>
      </Stack>
    </Section>
  );
}

