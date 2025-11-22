import { Section } from '@/components/ui/layout';
import { Heading, Paragraph } from '@/components/ui/typography';
import { Heart } from 'lucide-react';

export function EmptyWishlistState() {
  return (
    <Section padding="lg">
      <div className="text-center py-12">
        <Heart className="w-16 h-16 mx-auto text-text-secondary mb-4" />
        <Heading level={3}>Your wishlist is empty</Heading>
        <Paragraph variant="secondary" className="mt-2">
          Add books you want to read in the future to your wishlist
        </Paragraph>
      </div>
    </Section>
  );
}

