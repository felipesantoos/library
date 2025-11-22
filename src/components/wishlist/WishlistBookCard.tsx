import { BookDto } from '@/hooks/useBooks';
import { Section, Stack } from '@/components/ui/layout';
import { Heading, Paragraph, MetaText } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { BookOpen, Heart, Plus } from 'lucide-react';

interface WishlistBookCardProps {
  book: BookDto;
  onMoveToLibrary: (book: BookDto) => void;
  onClick: () => void;
}

export function WishlistBookCard({
  book,
  onMoveToLibrary,
  onClick,
}: WishlistBookCardProps) {
  return (
    <Section padding="md" className="hover:shadow-medium hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 ease-in-out">
      <Stack spacing="sm">
        <HandDrawnBox
          borderRadius={8}
          strokeWidth={1}
          linearCorners={true}
          className="aspect-[3/4] bg-background-surface rounded-md flex items-center justify-center overflow-hidden cursor-pointer relative transition-all duration-200 ease-in-out"
          onClick={onClick}
        >
          {book.cover_url ? (
            <img
              src={book.cover_url}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <BookOpen className="w-12 h-12 text-text-secondary" />
          )}
          <div className="absolute top-2 right-2">
            <Heart className="w-5 h-5 text-accent-primary fill-accent-primary" />
          </div>
        </HandDrawnBox>

        <div onClick={onClick} className="cursor-pointer">
          <Heading level={4} className="line-clamp-2 text-base">
            {book.title}
          </Heading>
          {book.author && (
            <Paragraph variant="secondary" className="mt-1 text-sm">
              {book.author}
            </Paragraph>
          )}
          {book.genre && (
            <MetaText className="text-xs mt-1 block">{book.genre}</MetaText>
          )}
        </div>

        {book.publication_year && (
          <MetaText className="text-xs">{book.publication_year}</MetaText>
        )}

        <Button
          onClick={(e) => {
            e.stopPropagation();
            onMoveToLibrary(book);
          }}
          variant="outline"
          size="sm"
          icon={<Plus />}
          iconPosition="left"
          className="w-full"
          title="Move to library"
        >
          Move to Library
        </Button>
      </Stack>
    </Section>
  );
}

