import { useState, useEffect } from 'react';
import { CreateBookCommand, BookDto } from '@/hooks/useBooks';
import { TagDto } from '@/hooks/useTags';
import { CollectionDto } from '@/hooks/useCollections';

interface UseBookFormProps {
  book: BookDto | null;
  isEditing: boolean;
  isWishlist: boolean;
  bookTags: TagDto[];
  bookCollections: CollectionDto[];
}

export function useBookForm({
  book,
  isEditing,
  isWishlist,
  bookTags,
  bookCollections,
}: UseBookFormProps) {
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
    status: 'not_started',
  });

  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<number[]>([]);

  // Initialize form data from book
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
        status: book.status,
      });
    } else if (!isEditing && isWishlist) {
      setFormData((prev) => ({ ...prev, is_wishlist: true }));
    }
  }, [book, isEditing, isWishlist]);

  // Load tags for editing
  useEffect(() => {
    if (bookTags && isEditing) {
      setSelectedTagIds(bookTags.filter((tag) => tag.id).map((tag) => tag.id!));
    }
  }, [bookTags, isEditing]);

  // Load collections for editing
  useEffect(() => {
    if (bookCollections && isEditing) {
      setSelectedCollectionIds(bookCollections.filter((c) => c.id).map((c) => c.id!));
    }
  }, [bookCollections, isEditing]);

  const handleChange = (field: keyof CreateBookCommand, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value || undefined }));
  };

  return {
    formData,
    selectedTagIds,
    selectedCollectionIds,
    setFormData,
    setSelectedTagIds,
    setSelectedCollectionIds,
    handleChange,
  };
}

