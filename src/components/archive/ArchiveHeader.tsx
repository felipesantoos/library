import { Heading, Paragraph } from '@/components/ui/typography';

interface ArchiveHeaderProps {
  bookCount: number;
}

export function ArchiveHeader({ bookCount }: ArchiveHeaderProps) {
  return (
    <div>
      <Heading level={1}>The Dusty Archives</Heading>
      <Paragraph variant="secondary" className="mt-2">
        {bookCount} {bookCount === 1 ? 'book' : 'books'} archived
      </Paragraph>
    </div>
  );
}

