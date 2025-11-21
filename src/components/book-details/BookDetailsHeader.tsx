import { useNavigate } from 'react-router-dom';
import { BookDto } from '@/hooks/useBooks';
import { Heading, Paragraph, MetaText } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Archive, RotateCcw, Edit } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';
import { toast } from '@/utils/toast';

interface BookDetailsHeaderProps {
  book: BookDto;
  onRefresh: () => void;
}

export function BookDetailsHeader({ book, onRefresh }: BookDetailsHeaderProps) {
  const navigate = useNavigate();

  const handleArchiveToggle = async () => {
    try {
      const updatedBook = {
        ...book,
        is_archived: !book.is_archived,
      };
      await invoke('update_book', { bookDto: updatedBook });
      toast.success(book.is_archived ? 'Book restored to library' : 'Book archived');
      onRefresh();
    } catch (err) {
      toast.handleError(err, 'Failed to update book');
    }
  };

  return (
    <div className="flex items-start space-x-4">
      <Button
        onClick={() => navigate('/library')}
        variant="ghost"
        size="sm"
        iconOnly
        icon={<ArrowLeft className="w-5 h-5" />}
        aria-label="Back to library"
        className="mt-1"
      />
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Heading level={1}>{book.title}</Heading>
            {book.author && (
              <Paragraph variant="secondary" className="mt-1">
                by {book.author}
              </Paragraph>
            )}
            {book.genre && (
              <MetaText className="mt-1 block">{book.genre}</MetaText>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleArchiveToggle}
              variant="outline"
              size="sm"
              iconOnly
              icon={book.is_archived ? <RotateCcw className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
              aria-label={book.is_archived ? "Restore book" : "Archive book"}
              title={book.is_archived ? "Restore to library" : "Archive book"}
            />
            <Button
              onClick={() => navigate(`/book/${book.id}/edit`)}
              variant="outline"
              size="sm"
              iconOnly
              icon={<Edit className="w-4 h-4" />}
              aria-label="Edit book"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

