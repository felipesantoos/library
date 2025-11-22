import { useLocation, useSearchParams } from 'react-router-dom';
import { useBook } from '@/hooks/useBooks';
import { useTags } from '@/hooks/useTags';
import { useCollections } from '@/hooks/useCollections';
import { Container, Stack, Section } from '@/components/ui/layout';
import { Paragraph } from '@/components/ui/typography';
import {
  BookFormHeader,
  BookFormError,
  BookFormBasicFields,
  BookFormProgressFields,
  BookFormMetadataFields,
  BookFormTagsAndCollections,
  BookFormActions,
  useBookForm,
  useBookFormSubmit,
} from '@/components/book-form';

export function BookFormPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Extract ID from pathname manually since we're not using Routes/Route
  const extractId = (pathname: string): string | null => {
    const match = pathname.match(/\/book\/(\d+)\/edit/);
    return match ? match[1] : null;
  };
  
  const id = extractId(location.pathname);
  const isEditing = !!id;
  const isWishlist = searchParams.get('wishlist') === 'true';
  
  const { book, loading: loadingBook } = useBook(id ? parseInt(id) : null);
  const { tags: bookTags, refresh: refreshBookTags } = useTags(id ? parseInt(id) : undefined);
  const { collections: bookCollections, refresh: refreshBookCollections } = useCollections(id ? parseInt(id) : undefined);

  const {
    formData,
    selectedTagIds,
    selectedCollectionIds,
    setSelectedTagIds,
    setSelectedCollectionIds,
    handleChange,
  } = useBookForm({
    book,
    isEditing,
    isWishlist,
    bookTags,
    bookCollections,
  });

  const { handleSubmit, loading, error } = useBookFormSubmit({
    isEditing,
    bookId: id,
    formData,
    selectedTagIds,
    selectedCollectionIds,
    bookTags,
    bookCollections,
    onRefreshTags: refreshBookTags,
    onRefreshCollections: refreshBookCollections,
  });

  if (isEditing && loadingBook) {
    return (
      <Container>
        <div className="py-8">
          <Paragraph>Loading book...</Paragraph>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <Stack spacing="lg">
          <BookFormHeader isEditing={isEditing} />

          {error && <BookFormError error={error} />}

          <form onSubmit={handleSubmit}>
            <Section padding="lg">
              <Stack spacing="md">
                <BookFormBasicFields
                  formData={formData}
                  onChange={handleChange}
                />

                <BookFormProgressFields
                  formData={formData}
                  onChange={handleChange}
                />

                <BookFormMetadataFields
                  formData={formData}
                  onChange={handleChange}
                />

                <BookFormTagsAndCollections
                  selectedTagIds={selectedTagIds}
                  selectedCollectionIds={selectedCollectionIds}
                  onTagIdsChange={setSelectedTagIds}
                  onCollectionIdsChange={setSelectedCollectionIds}
                  bookId={id ? parseInt(id) : undefined}
                />

                <BookFormActions loading={loading} />
              </Stack>
            </Section>
          </form>
        </Stack>
      </div>
    </Container>
  );
}
