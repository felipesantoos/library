import React, { useState } from 'react';
import { AgendaBlockDto, CreateAgendaBlockCommand, UpdateAgendaBlockCommand } from '@/hooks/useAgendaBlocks';
import { Book } from './types';
import { Section, Stack } from '@/components/ui/layout';
import { Button } from '@/components/ui/Button';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { HandDrawnDropdown } from '@/components/ui/inputs';
import { Plus } from 'lucide-react';

interface AgendaBlockFormProps {
  block: AgendaBlockDto | null;
  books: Book[];
  defaultDate: string;
  onSubmit: (command: CreateAgendaBlockCommand | UpdateAgendaBlockCommand) => void;
  onCancel: () => void;
}

export function AgendaBlockForm({
  block,
  books,
  defaultDate,
  onSubmit,
  onCancel,
}: AgendaBlockFormProps) {
  const [scheduledDate, setScheduledDate] = useState(block?.scheduled_date || defaultDate);
  const [bookId, setBookId] = useState<number | null>(block?.book_id || null);
  const [startTime, setStartTime] = useState<string>(block?.start_time?.substring(0, 5) || '');
  const [endTime, setEndTime] = useState<string>(block?.end_time?.substring(0, 5) || '');
  const [notes, setNotes] = useState<string>(block?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const command: CreateAgendaBlockCommand | UpdateAgendaBlockCommand = block
      ? {
          id: block.id!,
          scheduled_date: scheduledDate,
          book_id: bookId,
          start_time: startTime ? `${startTime}:00` : null,
          end_time: endTime ? `${endTime}:00` : null,
          notes: notes || null,
        }
      : {
          scheduled_date: scheduledDate,
          book_id: bookId,
          start_time: startTime ? `${startTime}:00` : null,
          end_time: endTime ? `${endTime}:00` : null,
          notes: notes || null,
        };
    
    onSubmit(command);
  };

  return (
    <Section padding="md" className="bg-background-surface border-2 border-accent-primary">
      <form onSubmit={handleSubmit}>
        <Stack spacing="md">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Date *
              </label>
              <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                <input
                  type="date"
                  required
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent text-text-primary focus:outline-none border-0"
                />
              </HandDrawnBox>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Book (optional)
              </label>
              <HandDrawnDropdown
                options={[
                  { value: '', label: 'No book' },
                  ...books.map((book) => ({
                    value: book.id || 0,
                    label: book.title || 'Untitled',
                  })),
                ]}
                value={bookId || ''}
                onChange={(value) => setBookId(value ? (typeof value === 'number' ? value : parseInt(value as string)) : null)}
                placeholder="No book"
                searchable={books.length > 5}
                borderRadius={6}
                strokeWidth={1}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                Start Time (optional)
              </label>
              <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent text-text-primary focus:outline-none border-0"
                />
              </HandDrawnBox>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">
                End Time (optional)
              </label>
              <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent text-text-primary focus:outline-none border-0"
                />
              </HandDrawnBox>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Notes (optional)
            </label>
            <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-transparent text-text-primary focus:outline-none resize-none border-0"
                placeholder="Optional notes about this reading block..."
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
              icon={<Plus />}
              iconPosition="left"
            >
              {block ? 'Update Block' : 'Create Block'}
            </Button>
          </div>
        </Stack>
      </form>
    </Section>
  );
}

