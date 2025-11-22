import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { toast } from '@/utils/toast';
import { registerBackup, BackupMetadata } from '@/hooks/useBackup';
import { BookDto } from '@/hooks/useBooks';
import { SessionDto } from '@/hooks/useSessions';
import { NoteDto } from '@/hooks/useNotes';

interface UseExportActionsProps {
  books: BookDto[];
  sessions: SessionDto[];
  notes: NoteDto[];
  onRefreshLastBackup?: () => void;
}

export function useExportActions({
  books,
  sessions,
  notes,
  onRefreshLastBackup,
}: UseExportActionsProps) {
  const [exporting, setExporting] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number | undefined>(undefined);

  const handleExportData = async () => {
    try {
      setExporting(true);
      
      const [booksData, sessionsData, notesData, goalsData] = await Promise.all([
        invoke<any[]>('list_books'),
        invoke<any[]>('list_sessions'),
        invoke<any[]>('list_notes'),
        invoke<any[]>('list_goals', { include_inactive: true }),
      ]);

      const backupData = {
        version: '1.0',
        exported_at: new Date().toISOString(),
        data: {
          books: booksData,
          sessions: sessionsData,
          notes: notesData,
          goals: goalsData,
        },
      };

      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reading-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      const fileName = `reading-backup-${new Date().toISOString().split('T')[0]}.json`;
      const metadata: BackupMetadata = {
        backup_type: 'full',
        book_count: booksData.length,
        session_count: sessionsData.length,
        note_count: notesData.length,
      };
      
      try {
        await registerBackup('', fileName, 'full', metadata);
        onRefreshLastBackup?.();
      } catch (err) {
        console.error('Failed to register backup:', err);
      }

      toast.success('Backup exported successfully!');
    } catch (err) {
      toast.handleError(err, 'Failed to export backup');
      console.error('Export error:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleExportYearStats = async (year: number) => {
    try {
      setExporting(true);
      
      const yearSessions = sessions.filter(s => {
        const sessionYear = new Date(s.session_date).getFullYear();
        return sessionYear === year;
      });

      const yearBooks = books.filter(b => {
        if (b.status === 'completed' && b.status_changed_at) {
          const completedYear = new Date(b.status_changed_at).getFullYear();
          return completedYear === year;
        }
        return false;
      });

      const backupData = {
        version: '1.0',
        exported_at: new Date().toISOString(),
        type: 'year_stats',
        year,
        data: {
          sessions: yearSessions,
          books_completed: yearBooks,
          statistics: {
            total_sessions: yearSessions.length,
            total_books_completed: yearBooks.length,
            total_pages_read: yearSessions.reduce((sum, s) => sum + (s.pages_read || 0), 0),
            total_minutes_read: yearSessions.reduce((sum, s) => sum + (s.minutes_read || 0), 0),
          },
        },
      };

      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reading-year-stats-${year}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      const metadata: BackupMetadata = {
        backup_type: 'year_stats',
        year,
        session_count: yearSessions.length,
        book_count: yearBooks.length,
      };
      
      try {
        await registerBackup('', link.download, 'year_stats', metadata);
      } catch (err) {
        console.error('Failed to register backup:', err);
      }

      toast.success(`Year ${year} statistics exported successfully!`);
    } catch (err) {
      toast.handleError(err, 'Failed to export year statistics');
      console.error('Export error:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleExportSingleBook = async (bookId: number) => {
    try {
      setExporting(true);
      
      const book = books.find(b => b.id === bookId);
      if (!book) {
        toast.error('Book not found');
        return;
      }

      const bookSessions = sessions.filter(s => s.book_id === bookId);
      const bookNotes = notes.filter(n => n.book_id === bookId);

      const backupData = {
        version: '1.0',
        exported_at: new Date().toISOString(),
        type: 'single_book',
        data: {
          book,
          sessions: bookSessions,
          notes: bookNotes,
        },
      };

      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reading-book-${book.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${book.id}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      const metadata: BackupMetadata = {
        backup_type: 'single_book',
        book_id: bookId,
        session_count: bookSessions.length,
        note_count: bookNotes.length,
      };
      
      try {
        await registerBackup('', link.download, 'single_book', metadata);
      } catch (err) {
        console.error('Failed to register backup:', err);
      }

      toast.success('Book data exported successfully!');
      setSelectedBookId(undefined);
    } catch (err) {
      toast.handleError(err, 'Failed to export book data');
      console.error('Export error:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleExportNotes = async () => {
    try {
      setExporting(true);
      
      const backupData = {
        version: '1.0',
        exported_at: new Date().toISOString(),
        type: 'notes',
        data: {
          notes,
        },
      };

      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reading-notes-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      const metadata: BackupMetadata = {
        backup_type: 'notes',
        note_count: notes.length,
      };
      
      try {
        await registerBackup('', link.download, 'notes', metadata);
      } catch (err) {
        console.error('Failed to register backup:', err);
      }

      toast.success('Notes exported successfully!');
    } catch (err) {
      toast.handleError(err, 'Failed to export notes');
      console.error('Export error:', err);
    } finally {
      setExporting(false);
    }
  };

  return {
    exporting,
    selectedBookId,
    setSelectedBookId,
    handleExportData,
    handleExportYearStats,
    handleExportSingleBook,
    handleExportNotes,
  };
}

