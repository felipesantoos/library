use serde::{Deserialize, Serialize};
use crate::domain::entities::ReadingSession;

/// Session Data Transfer Object for API communication
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SessionDto {
    pub id: Option<i64>,
    pub book_id: i64,
    pub reading_id: Option<i64>,
    pub session_date: String, // ISO date format (YYYY-MM-DD)
    pub start_time: Option<String>, // HH:MM:SS format
    pub end_time: Option<String>, // HH:MM:SS format
    pub start_page: Option<i32>,
    pub end_page: Option<i32>,
    pub pages_read: Option<i32>,
    pub minutes_read: Option<i32>,
    pub duration_seconds: Option<i32>,
    pub notes: Option<String>,
    pub photo_path: Option<String>,
    pub created_at: String, // ISO8601 string
    pub updated_at: String, // ISO8601 string
    pub duration_formatted: String, // Formatted duration (e.g., "1h 30m")
}

impl From<ReadingSession> for SessionDto {
    fn from(session: ReadingSession) -> Self {
        let duration_formatted = if let Some(seconds) = session.duration_seconds {
            format_duration(seconds)
        } else {
            String::new()
        };

        SessionDto {
            id: session.id,
            book_id: session.book_id,
            reading_id: session.reading_id,
            session_date: session.session_date.format("%Y-%m-%d").to_string(),
            start_time: session.start_time.map(|t| t.format("%H:%M:%S").to_string()),
            end_time: session.end_time.map(|t| t.format("%H:%M:%S").to_string()),
            start_page: session.start_page,
            end_page: session.end_page,
            pages_read: session.pages_read,
            minutes_read: session.minutes_read,
            duration_seconds: session.duration_seconds,
            notes: session.notes,
            photo_path: session.photo_path,
            created_at: session.created_at.to_rfc3339(),
            updated_at: session.updated_at.to_rfc3339(),
            duration_formatted,
        }
    }
}

fn format_duration(seconds: i32) -> String {
    let hours = seconds / 3600;
    let minutes = (seconds % 3600) / 60;
    
    if hours > 0 {
        if minutes > 0 {
            format!("{}h {}m", hours, minutes)
        } else {
            format!("{}h", hours)
        }
    } else {
        format!("{}m", minutes)
    }
}

/// Command for creating a session
#[derive(Debug, Deserialize)]
pub struct CreateSessionCommand {
    pub book_id: i64,
    pub reading_id: Option<i64>,
    pub session_date: String, // YYYY-MM-DD
    pub start_time: Option<String>, // HH:MM:SS
    pub end_time: Option<String>, // HH:MM:SS
    pub start_page: Option<i32>,
    pub end_page: Option<i32>,
    pub minutes_read: Option<i32>, // For audiobooks
    pub notes: Option<String>,
}

/// Command for updating a session
#[derive(Debug, Deserialize)]
pub struct UpdateSessionCommand {
    pub id: i64,
    pub session_date: Option<String>,
    pub start_time: Option<String>,
    pub end_time: Option<String>,
    pub start_page: Option<i32>,
    pub end_page: Option<i32>,
    pub minutes_read: Option<i32>,
    pub notes: Option<String>,
}

