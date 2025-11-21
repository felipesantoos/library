import { CollectionDto } from '@/hooks/useCollections';
import { Section, Stack } from '@/components/ui/layout';
import { Heading, Paragraph, MetaText } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';
import { Edit, Trash2 } from 'lucide-react';

interface CollectionCardProps {
  collection: CollectionDto;
  onEdit: () => void;
  onDelete: () => void;
}

export function CollectionCard({ collection, onEdit, onDelete }: CollectionCardProps) {
  return (
    <Section padding="md" className="hover:shadow-medium transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Stack spacing="sm">
            <div>
              <Heading level={4}>{collection.name}</Heading>
              {collection.description && (
                <Paragraph variant="secondary" className="mt-1 text-sm">
                  {collection.description}
                </Paragraph>
              )}
            </div>
            <MetaText className="text-xs">
              Created {new Date(collection.created_at).toLocaleDateString()}
            </MetaText>
          </Stack>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={onEdit}
            variant="ghost"
            size="sm"
            iconOnly
            icon={<Edit className="w-4 h-4" />}
            aria-label="Edit collection"
          />
          <Button
            onClick={onDelete}
            variant="ghost"
            size="sm"
            iconOnly
            icon={<Trash2 className="w-4 h-4" />}
            aria-label="Delete collection"
          />
        </div>
      </div>
    </Section>
  );
}

