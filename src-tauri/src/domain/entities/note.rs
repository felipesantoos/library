use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Note {
    pub id: Option<i64>,
    pub book_id: i64,
    pub reading_id: Option<i64>, // For rereads
    pub page: Option<i32>,
    pub content: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
}

impl Note {
    /// Creates a new Note with validation
    pub fn new(
        book_id: i64,
        content: String,
    ) -> Result<Self, String> {
        if content.trim().is_empty() {
            return Err("Note content cannot be empty".to_string());
        }

        Ok(Note {
            id: None,
            book_id,
            reading_id: None,
            page: None,
            content,
            created_at: chrono::Utc::now(),
            updated_at: chrono::Utc::now(),
        })
    }
}

