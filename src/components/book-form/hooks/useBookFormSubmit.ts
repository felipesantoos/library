import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBook, updateBook, CreateBookCommand, UpdateBookCommand } from '@/hooks/useBooks';
import { addTagsToBook, removeTagFromBook, TagDto } from '@/hooks/useTags';
import { addBooksToCollection, removeBookFromCollection, CollectionDto } from '@/hooks/useCollections';

interface UseBookFormSubmitProps {
  isEditing: boolean;
  bookId: string | undefined;
  formData: CreateBookCommand;
  selectedTagIds: number[];
  selectedCollectionIds: number[];
  bookTags: TagDto[];
  bookCollections: CollectionDto[];
  onRefreshTags: () => Promise<void>;
  onRefreshCollections: () => Promise<void>;
}

export function useBookFormSubmit({
  isEditing,
  bookId,
  formData,
  selectedTagIds,
  selectedCollectionIds,
  bookTags,
  bookCollections,
  onRefreshTags,
  onRefreshCollections,
}: UseBookFormSubmitProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let savedBookId: number;
      
      if (isEditing && bookId) {
        const updateCommand: UpdateBookCommand = {
          id: parseInt(bookId),
          title: formData.title,
          author: formData.author,
          genre: formData.genre,
          book_type: formData.book_type,
          isbn: formData.isbn,
          publication_year: formData.publication_year,
          total_pages: formData.total_pages,
          total_minutes: formData.total_minutes,
          cover_url: formData.cover_url,
          url: formData.url,
          is_wishlist: formData.is_wishlist,
        };
        await updateBook(updateCommand);
        savedBookId = parseInt(bookId);
      } else {
        const newBook = await createBook(formData);
        savedBookId = newBook.id!;
      }

      // Update tags
      if (savedBookId) {
        await onRefreshTags();
        const currentTagIds = bookTags.filter((tag) => tag.id).map((tag) => tag.id!);
        
        const tagsToAdd = selectedTagIds.filter((id) => !currentTagIds.includes(id));
        const tagsToRemove = currentTagIds.filter((id) => !selectedTagIds.includes(id));

        for (const tagId of tagsToRemove) {
          await removeTagFromBook(savedBookId, tagId);
        }

        if (tagsToAdd.length > 0) {
          await addTagsToBook({ book_id: savedBookId, tag_ids: tagsToAdd });
        }
      }

      // Update collections
      if (savedBookId) {
        await onRefreshCollections();
        const currentCollectionIds = bookCollections.filter((c) => c.id).map((c) => c.id!);
        
        const collectionsToAdd = selectedCollectionIds.filter((id) => !currentCollectionIds.includes(id));
        const collectionsToRemove = currentCollectionIds.filter((id) => !selectedCollectionIds.includes(id));

        for (const collectionId of collectionsToRemove) {
          await removeBookFromCollection(savedBookId, collectionId);
        }

        if (collectionsToAdd.length > 0) {
          for (const collectionId of collectionsToAdd) {
            await addBooksToCollection({ collection_id: collectionId, book_ids: [savedBookId] });
          }
        }
      }

      if (isEditing && bookId) {
        navigate(`/book/${bookId}`);
      } else {
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

  return {
    handleSubmit,
    loading,
    error,
  };
}

