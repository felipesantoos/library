import { useState, useEffect } from 'react';
import { CollectionDto } from '@/hooks/useCollections';
import { Section, Stack } from '@/components/ui/layout';
import { Button } from '@/components/ui/Button';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { Plus } from 'lucide-react';

interface CollectionFormProps {
  collection: CollectionDto | null;
  onSave: (command: { name: string; description?: string | null }) => Promise<void>;
  onCancel: () => void;
}

export function CollectionForm({ collection, onSave, onCancel }: CollectionFormProps) {
  const [name, setName] = useState(collection?.name || '');
  const [description, setDescription] = useState(collection?.description || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (collection) {
      setName(collection.name || '');
      setDescription(collection.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [collection]);

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
            <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none"
                placeholder="Collection name"
              />
            </HandDrawnBox>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Description
            </label>
            <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none resize-none"
                placeholder="Optional description"
              />
            </HandDrawnBox>
          </div>
          <div className="flex items-center justify-end space-x-3">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={saving || !name.trim()}
              loading={saving}
              icon={<Plus />}
              iconPosition="left"
            >
              {collection ? 'Update' : 'Create'}
            </Button>
          </div>
        </Stack>
      </form>
    </Section>
  );
}

