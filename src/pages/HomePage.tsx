import { useBooks } from '@/hooks/useBooks';
import { useSessions } from '@/hooks/useSessions';
import { Container, Stack } from '@/components/ui/layout';
import {
  HomeHeader,
  CurrentBookPanel,
  NoActiveReading,
  TodayProgressPanel,
  MonthlyGoalPanel,
  WeekSummaryPanel,
  QuickActionsPanel,
  useHomeData,
} from '@/components/home';

export function HomePage() {
  const { books: readingBooks } = useBooks({ status: 'reading', is_archived: false });
  const currentBook = readingBooks.length > 0 ? readingBooks[0] : null;
  
  const today = new Date().toISOString().split('T')[0];
  const { sessions: todaySessions } = useSessions({ start_date: today, end_date: today });
  
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const { sessions: weekSessions } = useSessions({ start_date: weekAgo, end_date: today });

  const { today: todayData, week: weekData } = useHomeData(todaySessions, weekSessions);

  // Placeholder for monthly goal (will be implemented in Goals section)
  const monthlyGoal = 500; // Placeholder
  const monthlyProgress = weekData.pages; // Placeholder - should calculate from all month sessions

  return (
    <Container>
      <div className="py-8">
        <Stack spacing="lg">
          <HomeHeader />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Stack spacing="md">
                {currentBook ? (
                  <CurrentBookPanel book={currentBook} />
                ) : (
                  <NoActiveReading />
                )}

                <TodayProgressPanel
                  pages={todayData.pages}
                  minutes={todayData.minutes}
                  sessions={todayData.sessions}
                />
              </Stack>
            </div>

            <div>
              <Stack spacing="md">
                <MonthlyGoalPanel
                  goal={monthlyGoal}
                  progress={monthlyProgress}
                />

                <WeekSummaryPanel
                  pages={weekData.pages}
                  daysActive={weekData.daysActive}
                  sessions={weekData.sessions}
                />

                <QuickActionsPanel />
              </Stack>
            </div>
          </div>
        </Stack>
      </div>
    </Container>
  );
}
