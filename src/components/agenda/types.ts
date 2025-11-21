import { AgendaBlockDto } from '@/hooks/useAgendaBlocks';

export interface SessionEvent {
  id: number;
  session_date: string;
  pages_read: number | null;
  minutes_read: number | null;
  book_id: number | null;
}

export interface DayEvents {
  blocks: AgendaBlockDto[];
  sessions: SessionEvent[];
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: DayEvents;
}

export interface Book {
  id: number;
  title: string;
  [key: string]: any;
}

