use serde::{Deserialize, Serialize};
use crate::core::domains::reading::Reading;

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum ReadingStatusDto {
    #[serde(rename = "not_started")]
    NotStarted,
    #[serde(rename = "reading")]
    Reading,
    #[serde(rename = "paused")]
    Paused,
    #[serde(rename = "abandoned")]
    Abandoned,
    #[serde(rename = "completed")]
    Completed,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReadingDto {
    pub id: Option<i64>,
    pub book_id: i64,
    pub reading_number: i32,
    pub started_at: Option<String>, // RFC3339 format
    pub completed_at: Option<String>, // RFC3339 format
    pub status: ReadingStatusDto,
    pub created_at: String, // RFC3339 format
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateReadingCommand {
    pub book_id: i64,
}

impl From<Reading> for ReadingDto {
    fn from(reading: Reading) -> Self {
        ReadingDto {
            id: reading.id,
            book_id: reading.book_id,
            reading_number: reading.reading_number,
            started_at: reading.started_at.map(|dt| dt.to_rfc3339()),
            completed_at: reading.completed_at.map(|dt| dt.to_rfc3339()),
            status: match reading.status {
                crate::core::domains::reading::ReadingStatus::NotStarted => ReadingStatusDto::NotStarted,
                crate::core::domains::reading::ReadingStatus::Reading => ReadingStatusDto::Reading,
                crate::core::domains::reading::ReadingStatus::Paused => ReadingStatusDto::Paused,
                crate::core::domains::reading::ReadingStatus::Abandoned => ReadingStatusDto::Abandoned,
                crate::core::domains::reading::ReadingStatus::Completed => ReadingStatusDto::Completed,
            },
            created_at: reading.created_at.to_rfc3339(),
        }
    }
}

