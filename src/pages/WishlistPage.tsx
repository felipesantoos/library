import { useNavigate } from 'react-router-dom';
import { useBooks } from '@/hooks/useBooks';
import { Container, Stack } from '@/components/ui/layout';
import { Paragraph } from '@/components/ui/typography';
import {
  WishlistHeader,
  EmptyWishlistState,
  WishlistBooksGrid,
  useWishlistActions,
} from '@/components/wishlist';

export function WishlistPage() {
  const navigate = useNavigate();
  const { books, loading, error, refresh } = useBooks({
    is_wishlist: true,
  });

  const { handleMoveToLibrary } = useWishlistActions({ onRefresh: refresh });

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
          <WishlistHeader booksCount={books.length} />

          {books.length === 0 ? (
            <EmptyWishlistState />
          ) : (
            <WishlistBooksGrid
              books={books}
              onMoveToLibrary={handleMoveToLibrary}
              onBookClick={(bookId) => navigate(`/book/${bookId}`)}
            />
          )}
        </Stack>
      </div>
    </Container>
  );
}
