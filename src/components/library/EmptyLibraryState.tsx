import { useNavigate } from 'react-router-dom';
import { Section } from '@/components/ui/layout';
import { Heading, Paragraph } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { BookOpen, X } from 'lucide-react';

interface EmptyLibraryStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export function EmptyLibraryState({ hasActiveFilters, onClearFilters }: EmptyLibraryStateProps) {
  const navigate = useNavigate();

  return (
    <Section padding="lg">
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 mx-auto text-text-secondary mb-4" />
        <Heading level={3}>
          {hasActiveFilters ? 'No books match your filters' : 'Your bookshelf is empty'}
        </Heading>
        <Paragraph variant="secondary" className="mt-2">
          {hasActiveFilters
            ? 'Try adjusting your filters or search query'
            : 'Add your first book to get started'}
        </Paragraph>
        {hasActiveFilters && (
          <div className="mt-4 flex justify-center">
            <Button
              onClick={onClearFilters}
              variant="primary"
              icon={<X />}
              iconPosition="left"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </Section>
  );
}

