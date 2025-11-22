use serde::{Deserialize, Serialize};
use crate::domain::entities::Note;

/// Note Data Transfer Object for API communication
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NoteDto {
    pub id: Option<i64>,
    pub book_id: i64,
    pub reading_id: Option<i64>,
    pub page: Option<i32>,
    pub content: String,
    pub created_at: String, // ISO8601 string
    pub updated_at: String, // ISO8601 string
}

impl From<Note> for NoteDto {
    fn from(note: Note) -> Self {
        NoteDto {
            id: note.id,
            book_id: note.book_id,
            reading_id: note.reading_id,
            page: note.page,
            content: note.content,
            created_at: note.created_at.to_rfc3339(),
            updated_at: note.updated_at.to_rfc3339(),
        }
    }
}

/// Command for creating a note
#[derive(Debug, Deserialize)]
pub struct CreateNoteCommand {
    pub book_id: i64,
    pub reading_id: Option<i64>,
    pub page: Option<i32>,
    pub content: String,
}

/// Command for updating a note
#[derive(Debug, Deserialize)]
pub struct UpdateNoteCommand {
    pub id: i64,
    pub page: Option<i32>,
    pub content: Option<String>,
}

