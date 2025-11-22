import { NoteDto } from '@/hooks/useNotes';
import { BookDto } from '@/hooks/useBooks';
import { Section, Stack } from '@/components/ui/layout';
import { Paragraph, MetaText } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';
import { FileText, Trash2, Edit } from 'lucide-react';

interface NoteCardProps {
  note: NoteDto;
  book: BookDto | null;
  onEdit?: (note: NoteDto) => void;
  onDelete: (id: number) => void;
  onBookClick: (bookId: number) => void;
}

export function NoteCard({ note, book, onEdit, onDelete, onBookClick }: NoteCardProps) {
  return (
    <Section padding="md" className="hover:shadow-medium hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 ease-in-out">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Stack spacing="sm">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-text-secondary" />
              <div>
                <div className="flex items-center space-x-2">
                  {book && (
                    <button
                      onClick={() => onBookClick(note.book_id!)}
                      className="font-semibold text-accent-primary hover:underline hover:text-accent-primary/80 transition-colors duration-200"
                    >
                      {book.title}
                    </button>
                  )}
                  {note.page && (
                    <MetaText className="text-xs">Page {note.page}</MetaText>
                  )}
                </div>
              </div>
            </div>

            <div className="pl-8">
              <Paragraph className="text-sm whitespace-pre-wrap">{note.content}</Paragraph>
            </div>

            <MetaText className="pl-8 text-xs">
              {new Date(note.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </MetaText>
          </Stack>
        </div>

        {note.id && (
          <div className="flex items-center space-x-2">
            {onEdit && (
              <Button
                onClick={() => onEdit(note)}
                variant="ghost"
                size="sm"
                iconOnly
                icon={<Edit className="w-4 h-4" />}
                aria-label="Edit note"
                title="Edit note"
              />
            )}
            <Button
              onClick={() => onDelete(note.id!)}
              variant="ghost"
              size="sm"
              iconOnly
              icon={<Trash2 className="w-4 h-4" />}
              aria-label="Delete note"
              title="Delete note"
              className="text-semantic-error hover:text-semantic-error hover:bg-semantic-error/10"
            />
          </div>
        )}
      </div>
    </Section>
  );
}

