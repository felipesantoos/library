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


