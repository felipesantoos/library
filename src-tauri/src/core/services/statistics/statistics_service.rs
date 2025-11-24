use crate::app::dtos::statistics_dto::{StatisticsDto, TodayStatistics, MonthStatistics, CurrentBookStatistics};
use crate::core::interfaces::primary::StatisticsService;
use crate::core::interfaces::secondary::{SessionRepository, BookRepository};
use crate::core::domains::book::BookStatus;
use chrono::Datelike;

/// Implementation of StatisticsService
pub struct StatisticsServiceImpl<'a> {
    session_repository: &'a dyn SessionRepository,
    book_repository: &'a dyn BookRepository,
}

impl<'a> StatisticsServiceImpl<'a> {
    pub fn new(
        session_repository: &'a dyn SessionRepository,
        book_repository: &'a dyn BookRepository,
    ) -> Self {
        StatisticsServiceImpl {
            session_repository,
            book_repository,
        }
    }
}

impl<'a> StatisticsService for StatisticsServiceImpl<'a> {
    fn get(&self) -> Result<StatisticsDto, String> {
        let today = chrono::Utc::now().date_naive();
        
        // Get today's sessions
        let today_sessions = self.session_repository.find_by_date_range(today, today)?;
        let today_stats = calculate_today_statistics(&today_sessions);

        // Get this month's sessions
        let month_start = chrono::NaiveDate::from_ymd_opt(today.year(), today.month(), 1)
            .ok_or("Invalid month start date")?;
        let month_sessions = self.session_repository.find_by_date_range(month_start, today)?;
        let month_stats = calculate_month_statistics(&month_sessions);

        // Get current book (status = "reading")
        let current_book = self.book_repository
            .find_by_status(BookStatus::Reading)?
            .first()
            .map(|book| {
                CurrentBookStatistics {
                    book_id: book.id.unwrap_or(0),
                    title: book.title.clone(),
                    author: book.author.clone(),
                    cover_url: book.cover_url.clone(),
                    current_page: book.current_page_text,
                    total_pages: book.total_pages,
                    progress_percentage: book.calculate_progress(),
                    status: "reading".to_string(),
                }
            });

        Ok(StatisticsDto {
            today: today_stats,
            this_month: month_stats,
            current_book,
        })
    }
}

fn calculate_today_statistics(sessions: &[crate::core::domains::session::ReadingSession]) -> TodayStatistics {
    let mut pages_read = 0;
    let mut minutes_read = 0;
    let mut duration_seconds = 0;

    for session in sessions {
        if let Some(pages) = session.pages_read {
            pages_read += pages;
        }
        if let Some(minutes) = session.minutes_read {
            minutes_read += minutes;
        }
        if let Some(duration) = session.duration_seconds {
            duration_seconds += duration;
        }
    }

    TodayStatistics {
        pages_read,
        minutes_read,
        sessions_count: sessions.len() as i32,
        duration_seconds,
    }
}

fn calculate_month_statistics(sessions: &[crate::core::domains::session::ReadingSession]) -> MonthStatistics {
    let mut pages_read = 0;
    let mut minutes_read = 0;

    for session in sessions {
        if let Some(pages) = session.pages_read {
            pages_read += pages;
        }
        if let Some(minutes) = session.minutes_read {
            minutes_read += minutes;
        }
    }

    MonthStatistics {
        pages_read,
        minutes_read,
        sessions_count: sessions.len() as i32,
        books_completed: 0, // TODO: Calculate from books with completed status this month
    }
}

