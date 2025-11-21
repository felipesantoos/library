import { useNavigate } from 'react-router-dom';
import { BookDto } from '@/hooks/useBooks';
import { Section, Stack } from '@/components/ui/layout';
import { Heading, Paragraph } from '@/components/ui/typography';
import { ProgressBar } from '@/components/ui/data-display';
import { Button } from '@/components/ui/Button';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { BookOpen, Play } from 'lucide-react';

interface CurrentBookPanelProps {
  book: BookDto;
}

export function CurrentBookPanel({ book }: CurrentBookPanelProps) {
  const navigate = useNavigate();

  return (
    <Section padding="lg">
      <Stack spacing="md">
        <div className="flex items-start space-x-4">
          <HandDrawnBox 
            borderRadius={8} 
            strokeWidth={1} 
            linearCorners={true}
            className="w-24 h-32 flex-shrink-0 bg-background-surface dark:bg-dark-background-surface rounded-md overflow-hidden"
          >
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
          </HandDrawnBox>

          <div className="flex-1">
            <Heading level={3}>{book.title}</Heading>
            {book.author && (
              <Paragraph variant="secondary" className="mt-1">
                by {book.author}
              </Paragraph>
            )}
            
            {(book.total_pages || book.total_minutes) && (
              <div className="mt-4">
                <ProgressBar
                  value={book.progress_percentage}
                  size="md"
                  showPercentage
                />
                <div className="flex items-center justify-between text-sm text-text-secondary dark:text-dark-text-secondary mt-2">
                  {book.total_pages && (
                    <span>
                      Page {book.current_page_text} of {book.total_pages}
                    </span>
                  )}
                  {book.total_minutes && (
                    <span>
                      {book.current_minutes_audio} / {book.total_minutes} minutes
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3 mt-4">
              <Button
                onClick={() => navigate(`/session/new?bookId=${book.id}`)}
                variant="primary"
                icon={<Play />}
                iconPosition="left"
              >
                Continue Reading
              </Button>
              <Button
                onClick={() => navigate(`/book/${book.id}`)}
                variant="outline"
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </Stack>
    </Section>
  );
}

