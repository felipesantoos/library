use serde::{Deserialize, Serialize};
use crate::domain::entities::journal_entry::JournalEntry;
use chrono::{NaiveDate, DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JournalEntryDto {
    pub id: Option<i64>,
    pub entry_date: String, // ISO date format: YYYY-MM-DD
    pub content: String,
    pub book_id: Option<i64>,
    pub created_at: String, // RFC3339 format
    pub updated_at: String, // RFC3339 format
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateJournalEntryCommand {
    pub entry_date: String, // ISO date format: YYYY-MM-DD
    pub content: String,
    pub book_id: Option<i64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateJournalEntryCommand {
    pub id: i64,
    pub entry_date: String, // ISO date format: YYYY-MM-DD
    pub content: String,
    pub book_id: Option<i64>,
}

impl From<JournalEntry> for JournalEntryDto {
    fn from(entry: JournalEntry) -> Self {
        JournalEntryDto {
            id: entry.id,
            entry_date: entry.entry_date.format("%Y-%m-%d").to_string(),
            content: entry.content,
            book_id: entry.book_id,
            created_at: entry.created_at.to_rfc3339(),
            updated_at: entry.updated_at.to_rfc3339(),
        }
    }
}

impl TryFrom<CreateJournalEntryCommand> for JournalEntry {
    type Error = String;

    fn try_from(command: CreateJournalEntryCommand) -> Result<Self, Self::Error> {
        let entry_date = NaiveDate::parse_from_str(&command.entry_date, "%Y-%m-%d")
            .map_err(|_| "Invalid date format. Expected YYYY-MM-DD".to_string())?;
        
        JournalEntry::new(entry_date, command.content, command.book_id)
    }
}

impl TryFrom<UpdateJournalEntryCommand> for JournalEntry {
    type Error = String;

    fn try_from(command: UpdateJournalEntryCommand) -> Result<Self, Self::Error> {
        let entry_date = NaiveDate::parse_from_str(&command.entry_date, "%Y-%m-%d")
            .map_err(|_| "Invalid date format. Expected YYYY-MM-DD".to_string())?;
        
        let now = Utc::now();
        Ok(JournalEntry {
            id: Some(command.id),
            entry_date,
            content: command.content,
            book_id: command.book_id,
            created_at: now, // Will be replaced by database value
            updated_at: now,
        })
    }
}

