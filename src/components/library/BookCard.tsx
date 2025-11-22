import { useNavigate } from 'react-router-dom';
import { BookDto } from '@/hooks/useBooks';
import { useTags } from '@/hooks/useTags';
import { useCollections } from '@/hooks/useCollections';
import { Section, Stack } from '@/components/ui/layout';
import { Heading, Paragraph } from '@/components/ui/typography';
import { ProgressBar } from '@/components/ui/data-display';
import { Tag } from '@/components/ui/tags';
import { BookOpen, FolderKanban } from 'lucide-react';
import { cn } from '@/lib/utils';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';

interface BookCardProps {
  book: BookDto;
  tagFilter?: number | null;
  collectionFilter?: number | null;
}

export function BookCard({ book, tagFilter, collectionFilter }: BookCardProps) {
  const navigate = useNavigate();
  const { tags } = useTags(book.id || undefined);
  const { collections } = useCollections(book.id || undefined);

  const matchesTagFilter = !tagFilter || tags.some((tag) => tag.id === tagFilter);
  const matchesCollectionFilter = !collectionFilter || collections.some((c) => c.id === collectionFilter);

  if (tagFilter && !matchesTagFilter) {
    return null;
  }
  if (collectionFilter && !matchesCollectionFilter) {
    return null;
  }

  const handleClick = () => {
    if (book.id) {
      navigate(`/book/${book.id}`);
    }
  };

  return (
    <Section
      padding="md"
      className="hover:shadow-medium hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-in-out cursor-pointer"
      onClick={handleClick}
    >
      <Stack spacing="sm">
        <HandDrawnBox
          borderRadius={6}
          strokeWidth={1}
          linearCorners={true}
          className="aspect-[3/4] bg-background-surface dark:bg-dark-background-surface rounded-md"
        >
          <div className="w-full h-full overflow-hidden rounded-md">
            {book.cover_url ? (
              <img
                src={book.cover_url}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-text-secondary dark:text-dark-text-secondary" />
              </div>
            )}
          </div>
        </HandDrawnBox>

        <div>
          <Heading level={4} className="line-clamp-2">
            {book.title}
          </Heading>
          {book.author && (
            <Paragraph variant="secondary" className="mt-1">
              {book.author}
            </Paragraph>
          )}
        </div>

        {book.total_pages && book.total_pages > 0 && (
          <ProgressBar
            value={book.progress_percentage}
            label={`${book.current_page_text} / ${book.total_pages} pages`}
            size="sm"
          />
        )}
        {book.total_minutes && book.total_minutes > 0 && (
          <ProgressBar
            value={book.progress_percentage}
            label={`${book.current_minutes_audio} / ${book.total_minutes} minutes`}
            size="sm"
          />
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag) => (
              <Tag
                key={tag.id}
                name={tag.name}
                color={tag.color || undefined}
                size="sm"
                variant="ghost"
              />
            ))}
            {tags.length > 2 && (
              <Tag
                name={`+${tags.length - 2}`}
                size="sm"
                variant="ghost"
              />
            )}
          </div>
        )}

        {collections.length > 0 && (
          <div className="flex flex-wrap gap-1 text-xs text-text-secondary">
            {collections.slice(0, 1).map((collection) => (
              <div
                key={collection.id}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-accent-primary/10 text-accent-primary border border-accent-primary/20"
              >
                <FolderKanban className="w-3 h-3" />
                <span>{collection.name}</span>
              </div>
            ))}
            {collections.length > 1 && (
              <span className="px-1.5 py-0.5 text-text-secondary">
                +{collections.length - 1}
              </span>
            )}
          </div>
        )}

        <div>
          <span
            className={cn(
              'inline-block px-2 py-1 rounded text-xs font-medium',
              book.status === 'reading'
                ? 'bg-accent-primary/20 text-accent-primary'
                : book.status === 'completed'
                ? 'bg-semantic-success/20 text-semantic-success'
                : 'bg-text-secondary/20 text-text-secondary'
            )}
          >
            {book.status.replace('_', ' ')}
          </span>
        </div>
      </Stack>
    </Section>
  );
}

