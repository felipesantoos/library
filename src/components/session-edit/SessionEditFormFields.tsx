import { BookDto } from '@/hooks/useBooks';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { Paragraph } from '@/components/ui/typography';

interface SessionEditFormFieldsProps {
  selectedBook: BookDto | null;
  sessionDate: string;
  startTime: string;
  endTime: string;
  startPage: number | null;
  endPage: number | null;
  minutesRead: number | null;
  onSessionDateChange: (value: string) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onStartPageChange: (value: number | null) => void;
  onEndPageChange: (value: number | null) => void;
  onMinutesReadChange: (value: number | null) => void;
}

export function SessionEditFormFields({
  selectedBook,
  sessionDate,
  startTime,
  endTime,
  startPage,
  endPage,
  minutesRead,
  onSessionDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onStartPageChange,
  onEndPageChange,
  onMinutesReadChange,
}: SessionEditFormFieldsProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">
          Date *
        </label>
        <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
          <input
            type="date"
            required
            value={sessionDate}
            onChange={(e) => onSessionDateChange(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none"
          />
        </HandDrawnBox>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Start Time
          </label>
          <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
            <input
              type="time"
              value={startTime}
              onChange={(e) => onStartTimeChange(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none"
            />
          </HandDrawnBox>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            End Time
          </label>
          <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
            <input
              type="time"
              value={endTime}
              onChange={(e) => onEndTimeChange(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none"
            />
          </HandDrawnBox>
        </div>
      </div>

      {selectedBook && selectedBook.book_type !== 'audiobook' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Start Page
            </label>
            <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
              <input
                type="number"
                min="0"
                value={startPage || ''}
                onChange={(e) => onStartPageChange(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none"
                placeholder="Page number"
              />
            </HandDrawnBox>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              End Page
            </label>
            <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
              <input
                type="number"
                min={startPage || 0}
                value={endPage || ''}
                onChange={(e) => onEndPageChange(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none"
                placeholder="Page number"
              />
            </HandDrawnBox>
            {startPage !== null && endPage !== null && endPage >= startPage && (
              <Paragraph variant="secondary" className="text-xs mt-1">
                Pages read: {endPage - startPage}
              </Paragraph>
            )}
          </div>
        </div>
      )}

      {selectedBook && selectedBook.book_type === 'audiobook' && (
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1">
            Minutes Read
          </label>
          <HandDrawnBox borderRadius={6} strokeWidth={1} linearCorners={true} className="w-full">
            <input
              type="number"
              min="0"
              value={minutesRead || ''}
              onChange={(e) => onMinutesReadChange(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-3 py-2 rounded-md bg-background-surface text-text-primary focus:outline-none"
              placeholder="Minutes"
            />
          </HandDrawnBox>
        </div>
      )}
    </>
  );
}

