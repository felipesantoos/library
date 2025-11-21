import { useNavigate } from 'react-router-dom';
import { useBooks } from '@/hooks/useBooks';
import { useSessions } from '@/hooks/useSessions';
import { Container, Stack, Section } from '@/components/ui/layout';
import { Heading, Paragraph, MetaText } from '@/components/ui/typography';
import { ProgressBar } from '@/components/ui/data-display';
import { BookOpen, Play, Target, TrendingUp, Calendar, Plus, Library } from 'lucide-react';
import { HandDrawnBox } from '@/components/ui/HandDrawnBox';
import { Button } from '@/components/ui/Button';

export function HomePage() {
  const navigate = useNavigate();
  
  // Get current reading book
  const { books: readingBooks } = useBooks({ status: 'reading', is_archived: false });
  const currentBook = readingBooks.length > 0 ? readingBooks[0] : null;
  
  // Get today's sessions
  const today = new Date().toISOString().split('T')[0];
  const { sessions: todaySessions } = useSessions({ start_date: today, end_date: today });
  
  // Calculate today's progress
  const todayPages = todaySessions.reduce((sum, s) => sum + (s.pages_read || 0), 0);
  const todayMinutes = todaySessions.reduce((sum, s) => sum + (s.minutes_read || 0), 0);
  const todayDuration = todaySessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0);

  // Get week's sessions for summary
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const { sessions: weekSessions } = useSessions({ start_date: weekAgo, end_date: today });
  
  const weekDays = new Set(weekSessions.map((s) => s.session_date)).size;
  const weekPages = weekSessions.reduce((sum, s) => sum + (s.pages_read || 0), 0);

  // Placeholder for monthly goal (will be implemented in Goals section)
  const monthlyGoal = 500; // Placeholder
  const monthlyProgress = weekPages; // Placeholder - should calculate from all month sessions

  return (
    <Container>
      <div className="py-8">
        <Stack spacing="lg">
          {/* Header */}
          <div>
            <Heading level={1}>The Reading Desk</Heading>
            <Paragraph variant="secondary" className="mt-2">
              Welcome back to your reading journey
            </Paragraph>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Current Book */}
            <div className="lg:col-span-2">
              <Stack spacing="md">
                {/* Current Book Panel */}
                {currentBook ? (
                  <Section padding="lg">
                    <Stack spacing="md">
                      <div className="flex items-start space-x-4">
                        {/* Book Cover */}
                        <HandDrawnBox borderRadius={8} strokeWidth={1} className="w-24 h-32 flex-shrink-0 bg-background-surface dark:bg-dark-background-surface rounded-md overflow-hidden">
                          {currentBook.cover_url ? (
                            <img
                              src={currentBook.cover_url}
                              alt={currentBook.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="w-12 h-12 text-text-secondary dark:text-dark-text-secondary" />
                            </div>
                          )}
                        </HandDrawnBox>

                        {/* Book Info */}
                        <div className="flex-1">
                          <Heading level={3}>{currentBook.title}</Heading>
                          {currentBook.author && (
                            <Paragraph variant="secondary" className="mt-1">
                              by {currentBook.author}
                            </Paragraph>
                          )}
                          
                          {/* Progress */}
                          {(currentBook.total_pages || currentBook.total_minutes) && (
                            <div className="mt-4">
                              <ProgressBar
                                value={currentBook.progress_percentage}
                                size="md"
                                showPercentage
                              />
                              <div className="flex items-center justify-between text-sm text-text-secondary dark:text-dark-text-secondary mt-2">
                                {currentBook.total_pages && (
                                  <span>
                                    Page {currentBook.current_page_text} of {currentBook.total_pages}
                                  </span>
                                )}
                                {currentBook.total_minutes && (
                                  <span>
                                    {currentBook.current_minutes_audio} / {currentBook.total_minutes} minutes
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center space-x-3 mt-4">
                            <button
                              onClick={() => navigate(`/session/new?bookId=${currentBook.id}`)}
                              className="flex items-center space-x-2 px-4 py-2 rounded-md bg-accent-primary text-dark-text-primary hover:bg-accent-primary/90 transition-colors"
                            >
                              <Play className="w-4 h-4" />
                              <span>Continue Reading</span>
                            </button>
                            <button
                              onClick={() => navigate(`/book/${currentBook.id}`)}
                              className="px-4 py-2 rounded-md border border-background-border dark:border-dark-background-border text-text-secondary dark:text-dark-text-secondary hover:bg-background-surface dark:hover:bg-dark-background-surface transition-colors"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </Stack>
                  </Section>
                ) : (
                  <Section padding="lg">
                    <div className="text-center py-8">
                      <BookOpen className="w-16 h-16 mx-auto text-text-secondary dark:text-dark-text-secondary mb-4" />
                      <Heading level={3}>No active reading</Heading>
                      <Paragraph variant="secondary" className="mt-2 mb-4">
                        Start a new book from your library
                      </Paragraph>
                      <button
                        onClick={() => navigate('/library')}
                        className="px-4 py-2 rounded-md bg-accent-primary text-dark-text-primary hover:bg-accent-primary/90 transition-colors"
                      >
                        Go to Library
                      </button>
                    </div>
                  </Section>
                )}

                {/* Today's Progress Panel */}
                <Section padding="md">
                  <Stack spacing="sm">
                    <div className="flex items-center justify-between">
                      <Heading level={4}>Today's Progress</Heading>
                      <Calendar className="w-5 h-5 text-text-secondary dark:text-dark-text-secondary" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div>
                        <MetaText>Pages</MetaText>
                        <Paragraph className="text-2xl font-bold mt-1">
                          {todayPages}
                        </Paragraph>
                      </div>
                      <div>
                        <MetaText>Minutes</MetaText>
                        <Paragraph className="text-2xl font-bold mt-1">
                          {todayMinutes || Math.floor(todayDuration / 60)}
                        </Paragraph>
                      </div>
                      <div>
                        <MetaText>Sessions</MetaText>
                        <Paragraph className="text-2xl font-bold mt-1">
                          {todaySessions.length}
                        </Paragraph>
                      </div>
                    </div>
                  </Stack>
                </Section>
              </Stack>
            </div>

            {/* Right Column - Stats & Goals */}
            <div>
              <Stack spacing="md">
                {/* Monthly Goal Panel */}
                <Section padding="md">
                  <Stack spacing="sm">
                    <div className="flex items-center justify-between">
                      <Heading level={4}>This Month</Heading>
                      <Target className="w-5 h-5 text-text-secondary dark:text-dark-text-secondary" />
                    </div>
                    
                    <ProgressBar
                      value={(monthlyProgress / monthlyGoal) * 100}
                      label={`${monthlyProgress} / ${monthlyGoal} pages`}
                      size="md"
                    />
                    
                    <Paragraph variant="secondary" className="text-sm">
                      {monthlyGoal - monthlyProgress} pages remaining
                    </Paragraph>
                  </Stack>
                </Section>

                {/* Week Summary Panel */}
                <Section padding="md">
                  <Stack spacing="sm">
                    <div className="flex items-center justify-between">
                      <Heading level={4}>This Week</Heading>
                      <TrendingUp className="w-5 h-5 text-text-secondary dark:text-dark-text-secondary" />
                    </div>
                    
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between">
                        <MetaText>Pages Read</MetaText>
                        <Paragraph className="font-semibold">{weekPages}</Paragraph>
                      </div>
                      <div className="flex items-center justify-between">
                        <MetaText>Days Active</MetaText>
                        <Paragraph className="font-semibold">{weekDays} / 7</Paragraph>
                      </div>
                      <div className="flex items-center justify-between">
                        <MetaText>Total Sessions</MetaText>
                        <Paragraph className="font-semibold">{weekSessions.length}</Paragraph>
                      </div>
                    </div>
                  </Stack>
                </Section>

                {/* Quick Actions */}
                <Section padding="md">
                  <Stack spacing="sm">
                    <Heading level={4}>Quick Actions</Heading>
                    <div className="space-y-1 pt-2">
                      <Button
                        onClick={() => navigate('/book/new')}
                        variant="ghost"
                        fullWidth
                        showBorder={false}
                        className="text-left justify-start"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Book
                      </Button>
                      <Button
                        onClick={() => navigate('/session/new')}
                        variant="ghost"
                        fullWidth
                        showBorder={false}
                        className="text-left justify-start"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Start Session
                      </Button>
                      <Button
                        onClick={() => navigate('/library')}
                        variant="ghost"
                        fullWidth
                        showBorder={false}
                        className="text-left justify-start"
                      >
                        <Library className="w-4 h-4 mr-2" />
                        View Library
                      </Button>
                    </div>
                  </Stack>
                </Section>
              </Stack>
            </div>
          </div>
        </Stack>
      </div>
    </Container>
  );
}
