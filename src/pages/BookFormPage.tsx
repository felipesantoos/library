import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { createBook, updateBook, useBook, BookDto, CreateBookCommand, UpdateBookCommand } from '@/hooks/useBooks';
import { Container, Stack, Section } from '@/components/ui/layout';
import { Heading, Paragraph } from '@/components/ui/typography';
import { TagSelector } from '@/components/ui/tags';
import { CollectionSelector } from '@/components/ui/collections';
import { useTags, addTagsToBook, removeTagFromBook } from '@/hooks/useTags';
import { useCollections, addBooksToCollection, removeBookFromCollection } from '@/hooks/useCollections';
import { ArrowLeft, Save, X } from 'lucide-react';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { HandDrawnDropdown } from '@/components/ui/inputs';

const BOOK_TYPES = [
  { value: 'physical_book', label: 'Physical Book' },
  { value: 'ebook', label: 'Ebook' },
  { value: 'audiobook', label: 'Audiobook' },
  { value: 'article', label: 'Article' },
  { value: 'PDF', label: 'PDF' },
  { value: 'comic', label: 'Comic' },
];

export function BookFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const isEditing = !!id;
  const isWishlist = searchParams.get('wishlist') === 'true';
  
  const { book, loading: loadingBook } = useBook(id ? parseInt(id) : null);
  const { tags: bookTags, refresh: refreshBookTags } = useTags(id ? parseInt(id) : undefined);
  const { collections: bookCollections, refresh: refreshBookCollections } = useCollections(id ? parseInt(id) : undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<number[]>([]);

  const [formData, setFormData] = useState<CreateBookCommand>({
    title: '',
    author: '',
    genre: '',
    book_type: 'physical_book',
    isbn: '',
    publication_year: undefined,
    total_pages: undefined,
    total_minutes: undefined,
    cover_url: '',
    url: '',
    is_wishlist: isWishlist,
  });

  useEffect(() => {
    if (book && isEditing) {
      setFormData({
        title: book.title,
        author: book.author || '',
        genre: book.genre || '',
        book_type: book.book_type,
        isbn: book.isbn || '',
        publication_year: book.publication_year || undefined,
        total_pages: book.total_pages || undefined,
        total_minutes: book.total_minutes || undefined,
        cover_url: book.cover_url || '',
        url: book.url || '',
        is_wishlist: book.is_wishlist,
        is_archived: book.is_archived,
      });
    } else if (!isEditing && isWishlist) {
      // Set wishlist flag for new books
      setFormData((prev) => ({ ...prev, is_wishlist: true }));
    }
  }, [book, isEditing, isWishlist]);

  // Load tags and collections for editing
  useEffect(() => {
    if (bookTags && isEditing) {
      setSelectedTagIds(bookTags.filter((tag) => tag.id).map((tag) => tag.id!));
    }
  }, [bookTags, isEditing]);

  useEffect(() => {
    if (bookCollections && isEditing) {
      setSelectedCollectionIds(bookCollections.filter((c) => c.id).map((c) => c.id!));
    }
  }, [bookCollections, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let savedBookId: number;
      
      if (isEditing && id) {
        const updateCommand: UpdateBookCommand = {
          id: parseInt(id),
          ...formData,
        };
        await updateBook(updateCommand);
        savedBookId = parseInt(id);
      } else {
        const newBook = await createBook(formData);
        savedBookId = newBook.id!;
      }

      // Update tags
      if (savedBookId) {
        // Get current tags for the book
        await refreshBookTags();
        const currentTagIds = bookTags.filter((tag) => tag.id).map((tag) => tag.id!);
        
        // Find tags to add and remove
        const tagsToAdd = selectedTagIds.filter((id) => !currentTagIds.includes(id));
        const tagsToRemove = currentTagIds.filter((id) => !selectedTagIds.includes(id));

        // Remove tags first
        for (const tagId of tagsToRemove) {
          await removeTagFromBook(savedBookId, tagId);
        }

        // Add new tags
        if (tagsToAdd.length > 0) {
          await addTagsToBook({ book_id: savedBookId, tag_ids: tagsToAdd });
        }
      }

      // Update collections
      if (savedBookId) {
        // Get current collections for the book
        await refreshBookCollections();
        const currentCollectionIds = bookCollections.filter((c) => c.id).map((c) => c.id!);
        
        // Find collections to add and remove
        const collectionsToAdd = selectedCollectionIds.filter((id) => !currentCollectionIds.includes(id));
        const collectionsToRemove = currentCollectionIds.filter((id) => !selectedCollectionIds.includes(id));

        // Remove collections first
        for (const collectionId of collectionsToRemove) {
          await removeBookFromCollection(savedBookId, collectionId);
        }

        // Add new collections
        if (collectionsToAdd.length > 0) {
          for (const collectionId of collectionsToAdd) {
            await addBooksToCollection({ collection_id: collectionId, book_ids: [savedBookId] });
          }
        }
      }

      if (isEditing && id) {
        navigate(`/book/${id}`);
      } else {
        // Navigate to wishlist if book was added to wishlist
        if (formData.is_wishlist) {
          navigate('/wishlist');
        } else {
          navigate('/library');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save book');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CreateBookCommand, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value || undefined }));
  };

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
          {/* Header */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/library')}
              className="p-2 rounded-md hover:bg-background-surface transition-colors"
              aria-label="Back to library"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Heading level={1}>
              {isEditing ? 'Edit Book' : 'Add New Book'}
            </Heading>
          </div>

          {/* Error Message */}
          {error && (
            <Section padding="sm" className="bg-semantic-error/10 border-semantic-error">
              <Paragraph variant="secondary" className="text-semantic-error">
                {error}
              </Paragraph>
            </Section>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Section padding="lg">
              <Stack spacing="md">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Title *
                  </label>
                  <HandDrawnBox borderRadius={6} strokeWidth={1} className="w-full">
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                      placeholder="Enter book title"
                    />
                  </HandDrawnBox>
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Author
                  </label>
                  <HandDrawnBox borderRadius={6} strokeWidth={1} className="w-full">
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => handleChange('author', e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                      placeholder="Enter author name"
                    />
                  </HandDrawnBox>
                </div>

                {/* Type and Genre */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Type *
                    </label>
                    <HandDrawnDropdown
                      options={BOOK_TYPES}
                      value={formData.book_type}
                      onChange={(value) => handleChange('book_type', value as string)}
                      placeholder="Select book type..."
                      borderRadius={6}
                      strokeWidth={1}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Genre
                    </label>
                    <HandDrawnBox borderRadius={6} strokeWidth={1} className="w-full">
                      <input
                        type="text"
                        value={formData.genre}
                        onChange={(e) => handleChange('genre', e.target.value)}
                        className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        placeholder="Enter genre"
                      />
                    </HandDrawnBox>
                  </div>
                </div>

                {/* Pages or Minutes */}
                {formData.book_type === 'audiobook' ? (
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Total Minutes *
                    </label>
                    <HandDrawnBox borderRadius={6} strokeWidth={1} className="w-full">
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.total_minutes || ''}
                        onChange={(e) =>
                          handleChange('total_minutes', e.target.value ? parseInt(e.target.value) : undefined)
                        }
                        className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        placeholder="Enter total minutes"
                      />
                    </HandDrawnBox>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Total Pages *
                    </label>
                    <HandDrawnBox borderRadius={6} strokeWidth={1} className="w-full">
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.total_pages || ''}
                        onChange={(e) =>
                          handleChange('total_pages', e.target.value ? parseInt(e.target.value) : undefined)
                        }
                        className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        placeholder="Enter total pages"
                      />
                    </HandDrawnBox>
                  </div>
                )}

                {/* Publication Year and ISBN */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Publication Year
                    </label>
                    <HandDrawnBox borderRadius={6} strokeWidth={1} className="w-full">
                      <input
                        type="number"
                        min="0"
                        max={new Date().getFullYear()}
                        value={formData.publication_year || ''}
                        onChange={(e) =>
                          handleChange(
                            'publication_year',
                            e.target.value ? parseInt(e.target.value) : undefined
                          )
                        }
                        className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        placeholder="Year"
                      />
                    </HandDrawnBox>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      ISBN
                    </label>
                    <HandDrawnBox borderRadius={6} strokeWidth={1} className="w-full">
                      <input
                        type="text"
                        value={formData.isbn}
                        onChange={(e) => handleChange('isbn', e.target.value)}
                        className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        placeholder="ISBN"
                      />
                    </HandDrawnBox>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Tags
                  </label>
                  <TagSelector
                    selectedTagIds={selectedTagIds}
                    onSelectionChange={setSelectedTagIds}
                    bookId={id ? parseInt(id) : undefined}
                  />
                </div>

                {/* Collections */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Collections
                  </label>
                  <CollectionSelector
                    selectedCollectionIds={selectedCollectionIds}
                    onSelectionChange={setSelectedCollectionIds}
                    bookId={id ? parseInt(id) : undefined}
                  />
                </div>

                {/* Cover URL and URL */}
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Cover URL
                  </label>
                  <HandDrawnBox borderRadius={6} strokeWidth={1} className="w-full">
                    <input
                      type="url"
                      value={formData.cover_url}
                      onChange={(e) => handleChange('cover_url', e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                      placeholder="https://example.com/cover.jpg"
                    />
                  </HandDrawnBox>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    URL (for articles, PDFs, etc.)
                  </label>
                  <HandDrawnBox borderRadius={6} strokeWidth={1} className="w-full">
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => handleChange('url', e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                      placeholder="https://example.com/article"
                    />
                  </HandDrawnBox>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/library')}
                    className="flex items-center space-x-2 px-4 py-2 rounded-md border border-background-border text-text-secondary hover:bg-background-surface transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 rounded-md bg-accent-primary text-dark-text-primary hover:bg-accent-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Save'}</span>
                  </button>
                </div>
              </Stack>
            </Section>
          </form>
        </Stack>
      </div>
    </Container>
  );
}

