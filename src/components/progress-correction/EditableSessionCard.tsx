import { SessionDto } from '@/hooks/useSessions';
import { BookDto } from '@/hooks/useBooks';
import { Section } from '@/components/ui/layout';
import { Paragraph } from '@/components/ui/typography';
import { Button } from '@/components/ui/Button';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditableSessionCardProps {
  session: Partial<SessionDto>;
  originalSession: SessionDto;
  book: BookDto;
  hasError: boolean;
  errorMessage?: string;
  hasWarning: boolean;
  warningMessage?: string;
  isEdited: boolean;
  onChange: (field: keyof SessionDto, value: any) => void;
  onDelete: () => void;
}

export function EditableSessionCard({
  session,
  originalSession,
  book,
  hasError,
  errorMessage,
  hasWarning,
  warningMessage,
  isEdited,
  onChange,
  onDelete,
}: EditableSessionCardProps) {
  return (
    <Section
      padding="md"
      className={cn(
        "hover:shadow-medium transition-shadow",
        hasError && "border-semantic-error border-2",
        hasWarning && !hasError && "border-semantic-warning border-2",
        isEdited && "bg-accent-primary/5"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          {/* Date and Time */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-text-secondary mb-1">Date</label>
              <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                <input
                  type="date"
                  value={session.session_date || ''}
                  onChange={(e) => onChange('session_date', e.target.value)}
                  className="w-full px-2 py-1 text-sm rounded-md bg-background-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                />
              </HandDrawnBox>
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">Start Time</label>
              <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                <input
                  type="time"
                  value={session.start_time?.substring(0, 5) || ''}
                  onChange={(e) => onChange('start_time', e.target.value ? `${e.target.value}:00` : null)}
                  className="w-full px-2 py-1 text-sm rounded-md bg-background-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                />
              </HandDrawnBox>
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1">End Time</label>
              <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                <input
                  type="time"
                  value={session.end_time?.substring(0, 5) || ''}
                  onChange={(e) => onChange('end_time', e.target.value ? `${e.target.value}:00` : null)}
                  className="w-full px-2 py-1 text-sm rounded-md bg-background-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                />
              </HandDrawnBox>
            </div>
          </div>

          {/* Pages / Minutes */}
          {book.book_type !== 'audiobook' ? (
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs text-text-secondary mb-1">Start Page</label>
                <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                  <input
                    type="number"
                    min="0"
                    max={book.total_pages || undefined}
                    value={session.start_page ?? ''}
                    onChange={(e) => onChange('start_page', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-2 py-1 text-sm rounded-md bg-background-surface text-text-primary focus:outline-none"
                  />
                </HandDrawnBox>
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1">End Page</label>
                <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                  <input
                    type="number"
                    min={session.start_page ?? 0}
                    max={book.total_pages || undefined}
                    value={session.end_page ?? ''}
                    onChange={(e) => onChange('end_page', e.target.value ? parseInt(e.target.value) : null)}
                    className="w-full px-2 py-1 text-sm rounded-md bg-background-surface text-text-primary focus:outline-none"
                  />
                </HandDrawnBox>
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1">Pages Read</label>
                <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                  <input
                    type="number"
                    value={session.pages_read ?? ''}
                    readOnly
                    className="w-full px-2 py-1 text-sm rounded-md bg-background-surface/50 text-text-secondary cursor-not-allowed"
                  />
                </HandDrawnBox>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs text-text-secondary mb-1">Minutes Read</label>
              <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                <input
                  type="number"
                  min="0"
                  value={session.minutes_read ?? ''}
                  onChange={(e) => onChange('minutes_read', e.target.value ? parseInt(e.target.value) : null)}
                  className="w-full px-2 py-1 text-sm rounded-md bg-background-surface text-text-primary focus:outline-none"
                />
              </HandDrawnBox>
            </div>
          )}

          {/* Notes - Only show if session has notes or is being edited */}
          {(session.notes || isEdited) && (
            <div>
              <label className="block text-xs text-text-secondary mb-1">Notes</label>
              <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
                <textarea
                  value={session.notes || ''}
                  onChange={(e) => onChange('notes', e.target.value || null)}
                  rows={2}
                  className="w-full px-2 py-1 text-sm rounded-md bg-background-surface text-text-primary focus:outline-none resize-none"
                  placeholder="Optional notes..."
                />
              </HandDrawnBox>
            </div>
          )}

          {/* Errors & Warnings */}
          {hasError && errorMessage && (
            <div className="flex items-center space-x-2 text-sm text-semantic-error">
              <AlertTriangle className="w-4 h-4" />
              <span>{errorMessage}</span>
            </div>
          )}
          {hasWarning && !hasError && warningMessage && (
            <div className="flex items-center space-x-2 text-sm text-semantic-warning">
              <AlertTriangle className="w-4 h-4" />
              <span>{warningMessage}</span>
            </div>
          )}

          {/* Edit indicator */}
          {isEdited && (
            <div className="flex items-center space-x-2 text-xs text-accent-primary">
              <CheckCircle className="w-3 h-3" />
              <span>Modified</span>
            </div>
          )}
        </div>

        <div className="ml-4">
          <Button
            onClick={onDelete}
            variant="ghost"
            size="sm"
            iconOnly
            icon={<Trash2 className="w-4 h-4" />}
            aria-label="Delete session"
          />
        </div>
      </div>
    </Section>
  );
}

