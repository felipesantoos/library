import { useMemo } from 'react';
import { AgendaBlockDto } from '@/hooks/useAgendaBlocks';
import { DayEvents, SessionEvent } from '../types';

/**
 * Group agenda blocks and sessions by date
 */
export function useEventsByDate(
  blocks: AgendaBlockDto[],
  sessions: SessionEvent[]
): Map<string, DayEvents> {
  return useMemo(() => {
    const grouped = new Map<string, DayEvents>();
    
    blocks.forEach((block) => {
      const date = block.scheduled_date;
      if (!grouped.has(date)) {
        grouped.set(date, { blocks: [], sessions: [] });
      }
      grouped.get(date)!.blocks.push(block);
    });

    sessions.forEach((session) => {
      const date = session.session_date;
      if (!grouped.has(date)) {
        grouped.set(date, { blocks: [], sessions: [] });
      }
      grouped.get(date)!.sessions.push(session);
    });

    return grouped;
  }, [blocks, sessions]);
}

