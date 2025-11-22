import { useNavigate } from 'react-router-dom';
import { Heading, Paragraph } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

interface WishlistHeaderProps {
  booksCount: number;
}

export function WishlistHeader({ booksCount }: WishlistHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div>
        <Heading level={1}>Wishlist</Heading>
        <Paragraph variant="secondary" className="mt-2">
          {booksCount} {booksCount === 1 ? 'book' : 'books'} in your wishlist
        </Paragraph>
      </div>
      <Button
        onClick={() => navigate('/book/new?wishlist=true')}
        variant="primary"
        icon={<Plus />}
        iconPosition="left"
      >
        Add to Wishlist
      </Button>
    </div>
  );
}

