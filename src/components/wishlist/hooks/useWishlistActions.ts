import { updateBook, BookDto } from '@/hooks/useBooks';
import { toast } from '@/utils/toast';

interface UseWishlistActionsProps {
  onRefresh: () => void;
}

export function useWishlistActions({ onRefresh }: UseWishlistActionsProps) {
  const handleMoveToLibrary = async (book: BookDto) => {
    try {
      await updateBook({
        ...book,
        is_wishlist: false,
      });
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

