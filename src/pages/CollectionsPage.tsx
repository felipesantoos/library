import { useState } from 'react';
import { useCollections, createCollection, updateCollection, CollectionDto } from '@/hooks/useCollections';
import { Container, Stack } from '@/components/ui/layout';
import { Paragraph } from '@/components/ui/typography';
import {
  CollectionsHeader,
  EmptyCollectionsState,
  CollectionsGrid,
  CollectionForm,
  useCollectionActions,
} from '@/components/collections';

export function CollectionsPage() {
  const { collections, loading, error, refresh } = useCollections();
  const [showForm, setShowForm] = useState(false);
  const [editingCollection, setEditingCollection] = useState<CollectionDto | null>(null);

  const { handleDelete } = useCollectionActions(refresh);

  const handleSave = async (command: { name: string; description?: string | null }) => {
    try {
      if (editingCollection?.id) {
        await updateCollection({ id: editingCollection.id, ...command });
      } else {
        await createCollection(command);
      }
      setShowForm(false);
      setEditingCollection(null);
      await refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save collection');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCollection(null);
  };

  const handleNewCollection = () => {
    setEditingCollection(null);
    setShowForm(true);
  };

  const handleEdit = (collection: CollectionDto) => {
    setEditingCollection(collection);
    setShowForm(true);
  };

  if (loading) {
    return (
      <Container>
        <div className="py-8">
          <Paragraph>Loading collections...</Paragraph>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="py-8">
          <Paragraph variant="secondary" className="text-semantic-error">
            Error: {error}
          </Paragraph>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8">
        <Stack spacing="lg">
          <CollectionsHeader onNewCollectionClick={handleNewCollection} />

          {showForm && (
            <CollectionForm
              collection={editingCollection}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}

          {collections.length === 0 && !showForm ? (
            <EmptyCollectionsState />
          ) : (
            <CollectionsGrid
              collections={collections}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </Stack>
      </div>
    </Container>
  );
}
