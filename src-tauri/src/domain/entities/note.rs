use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum NoteType {
    Note,
    Highlight,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum Sentiment {
    Inspiration,
    Doubt,
    Reflection,
    Learning,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Note {
    pub id: Option<i64>,
    pub book_id: i64,
    pub reading_id: Option<i64>, // For rereads
    pub page: Option<i32>,
    pub note_type: NoteType,
    pub excerpt: Option<String>, // Text that was highlighted
    pub content: String,
    pub sentiment: Option<Sentiment>,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
}

impl Note {
    /// Creates a new Note with validation
    pub fn new(
        book_id: i64,
        note_type: NoteType,
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
            note_type,
            excerpt: None,
            content,
            sentiment: None,
            created_at: chrono::Utc::now(),
            updated_at: chrono::Utc::now(),
        })
    }

    /// Creates a highlight note with excerpt
    pub fn new_highlight(
        book_id: i64,
        excerpt: String,
        content: String,
    ) -> Result<Self, String> {
        if excerpt.trim().is_empty() {
            return Err("Highlight excerpt cannot be empty".to_string());
        }

        Ok(Note {
            id: None,
            book_id,
            reading_id: None,
            page: None,
            note_type: NoteType::Highlight,
            excerpt: Some(excerpt),
            content,
            sentiment: None,
            created_at: chrono::Utc::now(),
            updated_at: chrono::Utc::now(),
        })
    }
}

