import { useState } from 'react';
import { useAgendaBlocks, AgendaBlockDto, CreateAgendaBlockCommand, UpdateAgendaBlockCommand } from '@/hooks/useAgendaBlocks';
import { useSessions } from '@/hooks/useSessions';
import { useBooks } from '@/hooks/useBooks';
import { Container, Stack, Section } from '@/components/ui/layout';
import {
  AgendaHeader,
  AgendaBlockForm,
  CalendarGrid,
  MonthNavigation,
  DayDetails,
  useCalendarDays,
  useEventsByDate,
  useAgendaActions,
  getMonthRange,
  formatDateToISO,
  SessionEvent,
  Book,
} from '@/components/agenda';

export function AgendaPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingBlock, setEditingBlock] = useState<AgendaBlockDto | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const { start, end } = getMonthRange(selectedDate);

  const { blocks, loading, error, refresh } = useAgendaBlocks(
    null,
    start,
    end,
    null
  );
  
  const { sessions } = useSessions({
    start_date: start,
    end_date: end,
  });
  
  const { books } = useBooks();

  const calendarDays = useCalendarDays(selectedDate);
  const eventsByDate = useEventsByDate(blocks, sessions as SessionEvent[]);
  
  const { handleCreate, handleUpdate, handleDelete } = useAgendaActions(() => {
    setShowForm(false);
    setEditingBlock(null);
    refresh();
  });

  const handleSubmit = async (command: CreateAgendaBlockCommand | UpdateAgendaBlockCommand) => {
    if ('id' in command) {
      await handleUpdate(command);
    } else {
      await handleCreate(command);
    }
  };

  const handleEdit = (block: AgendaBlockDto) => {
    setEditingBlock(block);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBlock(null);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
  };

  const handleBlockClick = (blockId: number) => {
    const block = blocks.find(b => b.id === blockId);
    if (block) {
      handleEdit(block);
    }
  };

  const selectedDateStr = formatDateToISO(selectedDate);
  const dayBlocks = blocks.filter(b => b.scheduled_date === selectedDateStr);
  const daySessions = sessions.filter(s => s.session_date === selectedDateStr) as SessionEvent[];

  return (
    <Container>
      <div className="py-8">
        <Stack spacing="lg">
          <AgendaHeader 
            onNewBlockClick={() => setShowForm(!showForm)}
            showForm={showForm}
          />

          {(showForm || editingBlock) && (
            <AgendaBlockForm
              block={editingBlock}
              books={books as Book[]}
              defaultDate={selectedDateStr}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          )}

          <Section padding="md">
            <Stack spacing="md">
              <MonthNavigation
                currentDate={selectedDate}
                onNavigate={navigateMonth}
              />

              <CalendarGrid
                days={calendarDays}
                eventsByDate={eventsByDate}
                selectedDate={selectedDate}
                onBlockClick={handleBlockClick}
                books={books as Book[]}
                loading={loading}
                error={error}
              />
            </Stack>
          </Section>

          {selectedDate && (
            <DayDetails
              date={selectedDateStr}
              blocks={dayBlocks}
              sessions={daySessions}
              books={books as Book[]}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </Stack>
      </div>
    </Container>
  );
}
