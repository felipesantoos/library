import { FolderKanban } from 'lucide-react';
import { MetaText } from '@/components/ui/typography';

interface Collection {
  id: number;
  name: string;
}

interface BookCollectionsSectionProps {
  collections: Collection[];
}

export function BookCollectionsSection({ collections }: BookCollectionsSectionProps) {
  if (collections.length === 0) {
    return null;
  }

  return (
    <div>
      <MetaText className="mb-2 block">Collections</MetaText>
      <div className="flex flex-wrap gap-2">
        {collections.map((collection) => (
          <div
            key={collection.id}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-accent-primary/20 text-accent-primary border border-accent-primary/30"
          >
            <FolderKanban className="w-3 h-3" />
            <span className="text-sm">{collection.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

