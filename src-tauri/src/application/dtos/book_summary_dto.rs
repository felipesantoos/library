use crate::application::use_cases::books::generate_summary::BookSummary;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BookSummaryDto {
    pub book_id: i64,
    pub book_title: String,
    pub book_author: Option<String>,
    pub total_notes: usize,
    pub notes_summary: String,
    pub key_themes: Vec<String>,
    pub generated_at: String,
}

impl From<BookSummary> for BookSummaryDto {
    fn from(summary: BookSummary) -> Self {
        BookSummaryDto {
            book_id: summary.book_id,
            book_title: summary.book_title,
            book_author: summary.book_author,
            total_notes: summary.total_notes,
            notes_summary: summary.notes_summary,
            key_themes: summary.key_themes,
            generated_at: summary.generated_at.to_rfc3339(),
        }
    }
}

