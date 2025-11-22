import { BookDto } from '@/hooks/useBooks';
import { SessionDto } from '@/hooks/useSessions';
import { NoteDto } from '@/hooks/useNotes';
import { Stack } from '@/components/ui/layout';
import { useLastBackupDate } from '@/hooks/useBackup';
import { useExportActions } from './hooks/useExportActions';
import { useImportActions } from './hooks/useImportActions';
import { LastBackupInfo } from './LastBackupInfo';
import { ExportFullBackup } from './ExportFullBackup';
import { PartialExports } from './PartialExports';
import { ImportBackup } from './ImportBackup';

interface DataTabProps {
  books: BookDto[];
  sessions: SessionDto[];
  notes: NoteDto[];
}

export function DataTab({ books, sessions, notes }: DataTabProps) {
  const { lastBackupDate, refresh: refreshLastBackup } = useLastBackupDate('full');
  
  const {
    exporting,
    selectedBookId,
    setSelectedBookId,
    handleExportData,
    handleExportYearStats,
    handleExportSingleBook,
    handleExportNotes,
  } = useExportActions({
    books,
    sessions,
    notes,
    onRefreshLastBackup: refreshLastBackup,
  });

  const { importing, handleImportBackup } = useImportActions();

  return (
    <Stack spacing="md">
      {lastBackupDate && <LastBackupInfo lastBackupDate={lastBackupDate} />}

      <ExportFullBackup
        exporting={exporting}
        onExport={handleExportData}
      />

      <PartialExports
        books={books}
        exporting={exporting}
        selectedBookId={selectedBookId}
        onExportYearStats={handleExportYearStats}
        onExportSingleBook={(bookId) => {
          setSelectedBookId(bookId);
          handleExportSingleBook(bookId);
        }}
        onExportNotes={handleExportNotes}
      />

      <ImportBackup
        importing={importing}
        exporting={exporting}
        onImport={handleImportBackup}
      />
    </Stack>
  );
}

