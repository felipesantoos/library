use serde::{Deserialize, Serialize};
use crate::domain::entities::{Note, NoteType, Sentiment};

/// Note Data Transfer Object for API communication
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NoteDto {
    pub id: Option<i64>,
    pub book_id: i64,
    pub reading_id: Option<i64>,
    pub page: Option<i32>,
    pub note_type: String, // Serialized NoteType
    pub excerpt: Option<String>,
    pub content: String,
    pub sentiment: Option<String>, // Serialized Sentiment
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
            note_type: note_type_to_string(&note.note_type),
            excerpt: note.excerpt,
            content: note.content,
            sentiment: note.sentiment.map(|s| sentiment_to_string(&s)),
            created_at: note.created_at.to_rfc3339(),
            updated_at: note.updated_at.to_rfc3339(),
        }
    }
}

fn note_type_to_string(note_type: &NoteType) -> String {
    match note_type {
        NoteType::Note => "note".to_string(),
        NoteType::Highlight => "highlight".to_string(),
    }
}

fn string_to_note_type(s: &str) -> Result<NoteType, String> {
    match s {
        "note" => Ok(NoteType::Note),
        "highlight" => Ok(NoteType::Highlight),
        _ => Err(format!("Invalid note type: {}", s)),
    }
}

fn sentiment_to_string(sentiment: &Sentiment) -> String {
    match sentiment {
        Sentiment::Inspiration => "inspiration".to_string(),
        Sentiment::Doubt => "doubt".to_string(),
        Sentiment::Reflection => "reflection".to_string(),
        Sentiment::Learning => "learning".to_string(),
    }
}

fn string_to_sentiment(s: &str) -> Result<Sentiment, String> {
    match s {
        "inspiration" => Ok(Sentiment::Inspiration),
        "doubt" => Ok(Sentiment::Doubt),
        "reflection" => Ok(Sentiment::Reflection),
        "learning" => Ok(Sentiment::Learning),
        _ => Err(format!("Invalid sentiment: {}", s)),
    }
}

/// Command for creating a note
#[derive(Debug, Deserialize)]
pub struct CreateNoteCommand {
    pub book_id: i64,
    pub reading_id: Option<i64>,
    pub page: Option<i32>,
    pub note_type: String,
    pub excerpt: Option<String>,
    pub content: String,
    pub sentiment: Option<String>,
}

/// Command for updating a note
#[derive(Debug, Deserialize)]
pub struct UpdateNoteCommand {
    pub id: i64,
    pub page: Option<i32>,
    pub content: Option<String>,
    pub excerpt: Option<String>,
    pub sentiment: Option<String>,
}

