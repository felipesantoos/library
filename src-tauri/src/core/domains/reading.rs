use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum ReadingStatus {
    NotStarted,
    Reading,
    Paused,
    Abandoned,
    Completed,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Reading {
    pub id: Option<i64>,
    pub book_id: i64,
    pub reading_number: i32, // 1 = first read, 2 = first reread, etc.
    pub started_at: Option<chrono::DateTime<chrono::Utc>>,
    pub completed_at: Option<chrono::DateTime<chrono::Utc>>,
    pub status: ReadingStatus,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

impl Reading {
    /// Creates a new Reading (for rereads)
    pub fn new(book_id: i64, reading_number: i32) -> Result<Self, String> {
        if reading_number < 1 {
            return Err("Reading number must be >= 1".to_string());
        }

        Ok(Reading {
            id: None,
            book_id,
            reading_number,
            started_at: None,
            completed_at: None,
            status: ReadingStatus::NotStarted,
            created_at: chrono::Utc::now(),
        })
    }

    /// Marks reading as started
    pub fn mark_as_started(&mut self) {
        if self.status == ReadingStatus::NotStarted {
            self.status = ReadingStatus::Reading;
            self.started_at = Some(chrono::Utc::now());
        }
    }

    /// Marks reading as completed
    pub fn mark_as_completed(&mut self) {
        self.status = ReadingStatus::Completed;
        self.completed_at = Some(chrono::Utc::now());
    }
}

