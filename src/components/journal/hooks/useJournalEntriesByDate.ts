import { useMemo } from 'react';
import { JournalEntryDto } from '@/hooks/useJournalEntries';

export function useJournalEntriesByDate(entries: JournalEntryDto[]) {
  return useMemo(() => {
    const grouped = new Map<string, JournalEntryDto[]>();
    entries.forEach((entry) => {
      const date = entry.entry_date;
      if (!grouped.has(date)) {
        grouped.set(date, []);
      }
      grouped.get(date)!.push(entry);
    });
    return grouped;
  }, [entries]);
}

