import { CollectionDto } from '@/hooks/useCollections';
import { CollectionCard } from './CollectionCard';

interface CollectionsGridProps {
  collections: CollectionDto[];
  onEdit: (collection: CollectionDto) => void;
  onDelete: (id: number, name: string) => void;
}

export function CollectionsGrid({ collections, onEdit, onDelete }: CollectionsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {collections.map((collection) => (
        <CollectionCard
          key={collection.id}
          collection={collection}
          onEdit={() => onEdit(collection)}
          onDelete={() => onDelete(collection.id!, collection.name)}
        />
      ))}
    </div>
  );
}

