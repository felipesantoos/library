import { SessionDto } from '@/hooks/useSessions';
import { BookOpen, Repeat } from 'lucide-react';
import { MetaText } from '@/components/ui/typography';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { cn } from '@/lib/utils';

interface Reading {
  id: number;
  reading_number: number;
  status: string;
}

interface ReadingCyclesListProps {
  readings: Reading[];
  sessions: SessionDto[];
  selectedReadingId: number | null;
  onSelectReading: (readingId: number | null) => void;
}

export function ReadingCyclesList({
  readings,
  sessions,
  selectedReadingId,
  onSelectReading,
}: ReadingCyclesListProps) {
  if (readings.length === 0) {
    return null;
  }

  return (
    <div>
      <MetaText className="mb-2 block">Reading Cycles</MetaText>
      <div className="space-y-2">
        <HandDrawnBox
          borderRadius={6}
          strokeWidth={1}
          linearCorners={true}
          className={cn(
            "p-2 cursor-pointer transition-colors",
            selectedReadingId === null
              ? "bg-accent-primary/20"
              : "bg-background-surface hover:bg-background-surface/80"
          )}
          onClick={() => onSelectReading(null)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-accent-primary" />
              <span className="text-sm font-medium">First Reading</span>
            </div>
            <MetaText className="text-xs">
              {sessions.filter(s => s.reading_id === null).length} sessions
            </MetaText>
          </div>
        </HandDrawnBox>
        {readings.map((reading) => (
          <HandDrawnBox
            key={reading.id}
            borderRadius={6}
            strokeWidth={1}
            linearCorners={true}
            className={cn(
              "p-2 cursor-pointer transition-colors",
              selectedReadingId === reading.id
                ? "bg-accent-primary/20"
                : "bg-background-surface hover:bg-background-surface/80"
            )}
            onClick={() => onSelectReading(reading.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Repeat className="w-4 h-4 text-accent-secondary" />
                <span className="text-sm font-medium">
                  Reading #{reading.reading_number}
                </span>
                {reading.status === 'completed' && (
                  <span className="text-xs text-semantic-success">✓</span>
                )}
              </div>
              <MetaText className="text-xs">
                {sessions.filter(s => s.reading_id === reading.id).length} sessions
              </MetaText>
            </div>
          </HandDrawnBox>
        ))}
      </div>
    </div>
  );
}

