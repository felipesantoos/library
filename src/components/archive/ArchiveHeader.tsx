import { Heading, Paragraph } from '@/components/ui/typography';

interface ArchiveHeaderProps {
  bookCount: number;
}

export function ArchiveHeader({ bookCount }: ArchiveHeaderProps) {
  return (
    <div>
        <Heading level={1}>Archive</Heading>
      <Paragraph variant="secondary" className="mt-2">
        {bookCount} {bookCount === 1 ? 'book' : 'books'} archived
      </Paragraph>
    </div>
  );
}

