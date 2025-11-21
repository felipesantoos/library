import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooks, updateBook, BookDto } from '@/hooks/useBooks';
import { Container, Stack, Section } from '@/components/ui/layout';
import { Heading, Paragraph, MetaText } from '@/components/ui/typography';
import { ProgressBar } from '@/components/ui/data-display';
import { BookOpen, Heart, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WishlistPage() {
  const navigate = useNavigate();
  const { books, loading, error, refresh } = useBooks({
    is_wishlist: true,
  });

  const handleMoveToLibrary = async (book: BookDto) => {
    try {
      await updateBook({
        ...book,
        is_wishlist: false,
      });
      refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to move book to library');
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="py-8">
          <Paragraph>Loading wishlist...</Paragraph>
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
              <Heading level={1}>The Wish Ledger</Heading>
              <Paragraph variant="secondary" className="mt-2">
                {books.length} {books.length === 1 ? 'book' : 'books'} in your wishlist
              </Paragraph>
            </div>
            <button
              onClick={() => navigate('/book/new?wishlist=true')}
              className="flex items-center space-x-2 px-4 py-2 rounded-md bg-accent-primary text-dark-text-primary hover:bg-accent-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Wishlist</span>
            </button>
          </div>

          {/* Books Grid */}
          {books.length === 0 ? (
            <Section padding="lg">
              <div className="text-center py-12">
                <Heart className="w-16 h-16 mx-auto text-text-secondary mb-4" />
                <Heading level={3}>Your wishlist is empty</Heading>
                <Paragraph variant="secondary" className="mt-2">
                  Add books you want to read in the future to your wishlist
                </Paragraph>
              </div>
            </Section>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <WishlistBookCard
                  key={book.id}
                  book={book}
                  onMoveToLibrary={handleMoveToLibrary}
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

function WishlistBookCard({
  book,
  onMoveToLibrary,
  onClick,
}: {
  book: BookDto;
  onMoveToLibrary: (book: BookDto) => void;
  onClick: () => void;
}) {
  return (
    <Section padding="md" className="hover:shadow-medium hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 ease-in-out">
      <Stack spacing="sm">
        {/* Cover */}
        <div
          className="aspect-[3/4] bg-background-surface border border-background-border rounded-md flex items-center justify-center overflow-hidden cursor-pointer relative hover:border-accent-primary/50 transition-all duration-200 ease-in-out"
          onClick={onClick}
        >
          {book.cover_url ? (
            <img
              src={book.cover_url}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <BookOpen className="w-12 h-12 text-text-secondary" />
          )}
          <div className="absolute top-2 right-2">
            <Heart className="w-5 h-5 text-accent-primary fill-accent-primary" />
          </div>
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
          {book.genre && (
            <MetaText className="text-xs mt-1 block">{book.genre}</MetaText>
          )}
        </div>

        {/* Metadata */}
        {book.publication_year && (
          <MetaText className="text-xs">{book.publication_year}</MetaText>
        )}

        {/* Actions */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMoveToLibrary(book);
          }}
          className="flex items-center justify-center space-x-2 w-full px-3 py-2 rounded-md border border-accent-primary text-accent-primary hover:bg-accent-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-in-out text-sm"
          title="Move to library"
        >
          <Plus className="w-4 h-4" />
          <span>Move to Library</span>
        </button>
      </Stack>
    </Section>
  );
}

