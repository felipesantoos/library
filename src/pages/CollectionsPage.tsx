import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCollections, createCollection, updateCollection, deleteCollection, CollectionDto } from '@/hooks/useCollections';
import { Container, Stack, Section } from '@/components/ui/layout';
import { Heading, Paragraph, MetaText } from '@/components/ui/typography';
import { ArrowLeft, Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CollectionsPage() {
  const navigate = useNavigate();
  const { collections, loading, error, refresh } = useCollections();
  const [showForm, setShowForm] = useState(false);
  const [editingCollection, setEditingCollection] = useState<CollectionDto | null>(null);

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete the collection "${name}"?`)) {
      try {
        await deleteCollection(id);
        await refresh();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to delete collection');
      }
    }
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
      <div className="py-8 max-w-4xl">
        <Stack spacing="lg">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-md hover:bg-background-surface transition-colors"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <Heading level={1}>Collections</Heading>
                <Paragraph variant="secondary" className="mt-2">
                  Organize your books into collections
                </Paragraph>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingCollection(null);
                setShowForm(true);
              }}
              className="flex items-center space-x-2 px-4 py-2 rounded-md bg-accent-primary text-dark-text-primary hover:bg-accent-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Collection</span>
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <CollectionForm
              collection={editingCollection}
              onSave={async (command) => {
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
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingCollection(null);
              }}
            />
          )}

          {/* Collections List */}
          {collections.length === 0 && !showForm ? (
            <Section padding="lg">
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto text-text-secondary mb-4" />
                <Heading level={3}>No collections yet</Heading>
                <Paragraph variant="secondary" className="mt-2">
                  Create your first collection to organize your books
                </Paragraph>
              </div>
            </Section>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  onEdit={() => {
                    setEditingCollection(collection);
                    setShowForm(true);
                  }}
                  onDelete={() => handleDelete(collection.id!, collection.name)}
                />
              ))}
            </div>
          )}
        </Stack>
      </div>
    </Container>
  );
}

function CollectionCard({
  collection,
  onEdit,
  onDelete,
}: {
  collection: CollectionDto;
  onEdit: () => void;
  onDelete: () => void;
}) {
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
          <button
            onClick={onEdit}
            className="p-2 text-text-secondary hover:text-accent-primary transition-colors"
            aria-label="Edit collection"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-text-secondary hover:text-semantic-error transition-colors"
            aria-label="Delete collection"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Section>
  );
}

function CollectionForm({
  collection,
  onSave,
  onCancel,
}: {
  collection: CollectionDto | null;
  onSave: (command: { name: string; description?: string | null }) => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState(collection?.name || '');
  const [description, setDescription] = useState(collection?.description || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim() || null,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Section padding="md">
      <form onSubmit={handleSubmit}>
        <Stack spacing="md">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
              placeholder="Collection name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-md bg-background-surface border border-background-border text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none"
              placeholder="Optional description"
            />
          </div>
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-md border border-background-border text-text-secondary hover:bg-background-surface transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="px-4 py-2 rounded-md bg-accent-primary text-dark-text-primary hover:bg-accent-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : collection ? 'Update' : 'Create'}
            </button>
          </div>
        </Stack>
      </form>
    </Section>
  );
}

