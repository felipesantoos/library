import { BookDto } from '@/hooks/useBooks';
import { Section } from '@/components/ui/layout';
import { Paragraph } from '@/components/ui/typography';

interface SessionEditBookInfoProps {
  book: BookDto;
}

export function SessionEditBookInfo({ book }: SessionEditBookInfoProps) {
  return (
    <Section padding="sm" className="bg-background-surface">
      <Paragraph variant="secondary" className="text-sm">
        <strong>{book.title}</strong>
        {book.author && ` by ${book.author}`}
      </Paragraph>
    </Section>
  );
}

