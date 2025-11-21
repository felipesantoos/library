use crate::domain::entities::{Book, ReadingSession};

/// Domain service for calculating reading progress
pub struct ProgressCalculator;

impl ProgressCalculator {
    /// Calculates book progress based on sessions
    pub fn calculate_from_sessions(
        book: &Book,
        sessions: &[ReadingSession],
    ) -> Result<i32, String> {
        let mut total_pages = 0;

        for session in sessions {
            if session.book_id == book.id.unwrap_or(0) {
                if let Some(pages) = session.pages_read {
                    total_pages += pages;
                }
            }
        }

        Ok(total_pages)
    }

    /// Calculates progress percentage
    pub fn calculate_percentage(current: i32, total: i32) -> f64 {
        if total <= 0 {
            return 0.0;
        }
        ((current as f64 / total as f64) * 100.0).min(100.0)
    }

    /// Calculates hybrid progress (text + audio)
    pub fn calculate_hybrid_progress(
        current_page_text: i32,
        total_pages: Option<i32>,
        current_minutes_audio: i32,
        total_minutes: Option<i32>,
    ) -> f64 {
        let text_progress = if let Some(total) = total_pages {
            Self::calculate_percentage(current_page_text, total) * 0.5
        } else {
            0.0
        };

        let audio_progress = if let Some(total) = total_minutes {
            Self::calculate_percentage(current_minutes_audio, total) * 0.5
        } else {
            0.0
        };

        text_progress + audio_progress
    }
}

