use crate::core::domains::book::Book;
use crate::core::domains::session::ReadingSession;

/// Domain service for calculating reading statistics
pub struct StatisticsCalculator;

impl StatisticsCalculator {
    /// Calculates total pages read from sessions
    pub fn total_pages_read(sessions: &[ReadingSession]) -> i32 {
        sessions
            .iter()
            .filter_map(|s| s.pages_read)
            .sum()
    }

    /// Calculates total minutes listened from sessions
    pub fn total_minutes_listened(sessions: &[ReadingSession]) -> i32 {
        sessions
            .iter()
            .filter_map(|s| s.minutes_read)
            .sum()
    }

    /// Calculates average reading speed (pages per hour)
    pub fn average_reading_speed(sessions: &[ReadingSession]) -> Option<f64> {
        let total_pages: i32 = Self::total_pages_read(sessions);
        let total_seconds: i32 = sessions
            .iter()
            .filter_map(|s| s.duration_seconds)
            .sum();

        if total_seconds > 0 {
            let hours = total_seconds as f64 / 3600.0;
            Some(total_pages as f64 / hours)
        } else {
            None
        }
    }

    /// Calculates books completed count
    pub fn books_completed(books: &[Book]) -> usize {
        books
            .iter()
            .filter(|b| b.status == crate::core::domains::book::BookStatus::Completed)
            .count()
    }

    /// Groups books by genre
    pub fn books_by_genre(books: &[Book]) -> std::collections::HashMap<String, usize> {
        let mut genre_map = std::collections::HashMap::new();
        for book in books {
            if let Some(genre) = &book.genre {
                *genre_map.entry(genre.clone()).or_insert(0) += 1;
            }
        }
        genre_map
    }
}

