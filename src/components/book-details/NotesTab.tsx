import { useState } from 'react';
import { Stack, Section } from '@/components/ui/layout';
import { MetaText, Paragraph } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';
import { HandDrawnModal } from '@/components/ui/HandDrawnModal';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { EmptyState } from './EmptyState';
import { NoteDto, updateNote, deleteNote, UpdateNoteCommand } from '@/hooks/useNotes';
import { Edit, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface NotesTabProps {
  notes: NoteDto[];
  bookId: number;
  onNoteCreated?: () => void;
  onNoteUpdated?: () => void;
  onNoteDeleted?: () => void;
}

export function NotesTab({ notes, onNoteUpdated, onNoteDeleted }: NotesTabProps) {
  const [editingNote, setEditingNote] = useState<NoteDto | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editPage, setEditPage] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleEdit = (note: NoteDto) => {
    setEditingNote(note);
    setEditContent(note.content);
    setEditPage(note.page);
  };

  const handleSaveEdit = async () => {
    if (!editingNote || !editingNote.id) return;
    
    if (!editContent.trim()) {
      toast.error('Please enter note content');
      return;
    }

    try {
      setSaving(true);
      // Build command - always include page when editing to allow clearing it
      // We need to explicitly send null when the field is cleared
      const command: any = {
        id: editingNote.id,
        content: editContent.trim(),
      };
      
      // Always include page field when editing (even if null) to allow clearing
      if (editPage === null || editPage === undefined) {
        command.page = null; // Explicitly set to null to clear
        console.log('[NotesTab] Sending page as null to clear');
      } else {
        command.page = editPage; // Set to the number value
        console.log('[NotesTab] Sending page as:', editPage);
      }
      
      console.log('[NotesTab] Full command:', JSON.stringify(command, null, 2));
      await updateNote(command as UpdateNoteCommand);
      toast.success('Note updated successfully');
      setEditingNote(null);
      setEditContent('');
      setEditPage(null);
      onNoteUpdated?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update note');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (noteId: number) => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      setDeletingId(noteId);
      await deleteNote(noteId);
      toast.success('Note deleted successfully');
      onNoteDeleted?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete note');
    } finally {
      setDeletingId(null);
    }
  };

  if (notes.length === 0) {
    return <EmptyState type="notes" />;
  }

  return (
    <>
      <Stack spacing="sm">
        {notes.map((note) => (
          <Section key={note.id || Math.random()} padding="md" className="hover:shadow-medium transition-shadow">
            <Stack spacing="sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <MetaText className="text-xs">
                    {note.page && `Page ${note.page} • `}
                    {new Date(note.created_at).toLocaleDateString()}
                  </MetaText>
                  <Paragraph className="text-sm mt-1">{note.content}</Paragraph>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    onClick={() => handleEdit(note)}
                    variant="ghost"
                    size="sm"
                    icon={<Edit className="w-4 h-4" />}
                    iconOnly
                    title="Edit note"
                  />
                  <Button
                    onClick={() => note.id && handleDelete(note.id)}
                    variant="ghost"
                    size="sm"
                    icon={<Trash2 className="w-4 h-4" />}
                    iconOnly
                    loading={deletingId === note.id}
                    title="Delete note"
                    className="text-semantic-error hover:text-semantic-error hover:bg-semantic-error/10"
                  />
                </div>
              </div>
            </Stack>
          </Section>
        ))}
      </Stack>

      {editingNote && (
        <HandDrawnModal
          isOpen={!!editingNote}
          onClose={() => {
            setEditingNote(null);
            setEditContent('');
            setEditPage(null);
          }}
          title="Edit Note"
          maxWidth="md"
        >
          <Stack spacing="md">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Page (optional)
              </label>
              <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                <input
                  type="number"
                  min="0"
                  value={editPage ?? ''}
                  onChange={(e) => {
                    const value = e.target.value.trim();
                    if (value === '') {
                      setEditPage(null);
                    } else {
                      const parsed = parseInt(value, 10);
                      setEditPage(isNaN(parsed) ? null : parsed);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none"
                  placeholder="Page number"
                />
              </HandDrawnBox>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Content *
              </label>
              <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none resize-none"
                  rows={4}
                  placeholder="Enter your note here..."
                />
              </HandDrawnBox>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <Button
                type="button"
                onClick={() => {
                  setEditingNote(null);
                  setEditContent('');
                  setEditPage(null);
                }}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveEdit}
                variant="primary"
                icon={<Save />}
                iconPosition="left"
                loading={saving}
                disabled={!editContent.trim()}
              >
                Save Note
              </Button>
            </div>
          </Stack>
        </HandDrawnModal>
      )}
    </>
  );
}

