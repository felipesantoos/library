import { BookDto } from '@/hooks/useBooks';
import { SessionDto } from '@/hooks/useSessions';
import { Section, Stack } from '@/components/ui/layout';
import { BookProgressSection } from './BookProgressSection';
import { BookMetadataSection } from './BookMetadataSection';
import { BookTagsSection } from './BookTagsSection';
import { BookCollectionsSection } from './BookCollectionsSection';
import { ReadingCyclesList } from './ReadingCyclesList';
import { BookActionsSection } from './BookActionsSection';

interface BookInfoSectionProps {
  book: BookDto;
  tags: any[];
  collections: any[];
  readings: any[];
  sessions: SessionDto[];
  selectedReadingId: number | null;
  onSelectReading: (readingId: number | null) => void;
  onRefresh: () => void;
  onRefreshReadings: () => void;
  onRefreshCurrentReading: () => void;
  onNoteCreated?: () => void;
}

export function BookInfoSection({
  book,
  tags,
  collections,
  readings,
  sessions,
  selectedReadingId,
  onSelectReading,
  onRefresh,
  onRefreshReadings,
  onRefreshCurrentReading,
  onNoteCreated,
}: BookInfoSectionProps) {
  return (
    <div className="md:col-span-2">
      <Section padding="md">
        <Stack spacing="md">
          <BookProgressSection book={book} onRefresh={onRefresh} />

          <BookMetadataSection book={book} readingsCount={readings.length} />

          <BookTagsSection tags={tags} />

          <BookCollectionsSection collections={collections} />

          <ReadingCyclesList
            readings={readings}
            sessions={sessions}
            selectedReadingId={selectedReadingId}
            onSelectReading={onSelectReading}
          />

          <BookActionsSection
            book={book}
            selectedReadingId={selectedReadingId}
            readingsCount={readings.length}
            onRefresh={onRefresh}
            onRefreshReadings={onRefreshReadings}
            onRefreshCurrentReading={onRefreshCurrentReading}
            onNoteCreated={onNoteCreated}
          />
        </Stack>
      </Section>
    </div>
  );
}

