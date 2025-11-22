import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useBooks } from '@/hooks/useBooks';
import { useCollections } from '@/hooks/useCollections';
import { useBookCollections } from '@/hooks/useBookCollections';
import { Container, Stack } from '@/components/ui/layout';
import { Paragraph, Heading } from '@/components/ui/typography';
import { BooksGrid } from '@/components/library';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export function CollectionDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract ID from pathname
  const extractId = (pathname: string): string | null => {
    const match = pathname.match(/\/collection\/(\d+)/);
    return match ? match[1] : null;
  };
  
  const id = extractId(location.pathname);
  const collectionId = id ? parseInt(id, 10) : null;
  
  // Validate that collectionId is a valid number
  if (id && (isNaN(collectionId as number) || collectionId === null)) {
    return (
      <Container>
        <div className="py-8">
          <Paragraph variant="secondary" className="text-semantic-error">
            Error: Invalid collection ID
          </Paragraph>
        </div>
      </Container>
    );
  }

  const { collections, loading: loadingCollections } = useCollections();
  const { books: allBooks, loading: loadingBooks, error } = useBooks({
    is_archived: false,
    is_wishlist: false,
  });

  const collection = collections.find((c) => c.id === collectionId);
  // Pass all books - BookCard will filter by collectionFilter
  const books = allBooks;

  // Get all book IDs to load their collections
  const bookIds = useMemo(() => books.map((b) => b.id!).filter((id): id is number => id !== undefined), [books]);
  const { bookCollections } = useBookCollections(bookIds);

  if (loadingCollections || loadingBooks) {
    return (
      <Container>
        <div className="py-8">
          <Paragraph>Loading...</Paragraph>
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

  if (!collection) {
    return (
      <Container>
        <div className="py-8">
          <Paragraph variant="secondary" className="text-semantic-error">
            Collection not found
          </Paragraph>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <Stack spacing="lg">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/collections')}
              variant="ghost"
              size="sm"
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back to Collections
            </Button>
          </div>

          <div>
            <Heading level={2}>{collection.name}</Heading>
            {collection.description && (
              <Paragraph variant="secondary" className="mt-2">
                {collection.description}
              </Paragraph>
            )}
          </div>

          <BooksGrid
            books={books}
            viewMode="grid"
            tagFilter={null}
            collectionFilter={collectionId}
            bookCollections={bookCollections}
          />
        </Stack>
      </div>
    </Container>
  );
}

