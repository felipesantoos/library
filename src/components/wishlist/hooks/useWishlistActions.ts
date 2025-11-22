import { updateBook, BookDto, UpdateBookCommand } from '@/hooks/useBooks';
import { toast } from '@/utils/toast';

interface UseWishlistActionsProps {
  onRefresh: () => void;
}

export function useWishlistActions({ onRefresh }: UseWishlistActionsProps) {
  const handleMoveToLibrary = async (book: BookDto) => {
    try {
      if (!book.id) {
        throw new Error('Book ID is required');
      }

      const command: UpdateBookCommand = {
        id: book.id,
        is_wishlist: false,
      };
      
      await updateBook(command);
      toast.success('Book moved to library successfully');
      onRefresh();
    } catch (err) {
      toast.handleError(err, 'Failed to move book to library');
    }
  };

  return {
    handleMoveToLibrary,
  };
}

