import { useNavigate } from 'react-router-dom';
import { useBooks } from '@/hooks/useBooks';
import { Container, Stack } from '@/components/ui/layout';
import { Paragraph } from '@/components/ui/typography';
import {
  ArchiveHeader,
  EmptyArchiveState,
  ArchiveBooksGrid,
  useArchiveActions,
} from '@/components/archive';

export function ArchivePage() {
  const navigate = useNavigate();
  const { books, loading, error, refresh } = useBooks({
    is_archived: true,
  });

  const { handleRestore } = useArchiveActions(refresh);

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
          <ArchiveHeader bookCount={books.length} />

          {books.length === 0 ? (
            <EmptyArchiveState />
          ) : (
            <ArchiveBooksGrid
              books={books}
              onRestore={handleRestore}
              onBookClick={(bookId) => navigate(`/book/${bookId}`)}
            />
          )}
        </Stack>
      </div>
    </Container>
  );
}
