use serde::{Deserialize, Serialize};
use crate::domain::entities::agenda_block::AgendaBlock;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgendaBlockDto {
    pub id: Option<i64>,
    pub book_id: Option<i64>,
    pub scheduled_date: String, // ISO date format: YYYY-MM-DD
    pub start_time: Option<String>, // ISO8601 time format (HH:MM:SS)
    pub end_time: Option<String>,   // ISO8601 time format (HH:MM:SS)
    pub is_completed: bool,
    pub completed_session_id: Option<i64>,
    pub notes: Option<String>,
    pub created_at: String, // RFC3339 format
    pub updated_at: String, // RFC3339 format
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateAgendaBlockCommand {
    pub book_id: Option<i64>,
    pub scheduled_date: String, // ISO date format: YYYY-MM-DD
    pub start_time: Option<String>, // ISO8601 time format (HH:MM:SS)
    pub end_time: Option<String>,   // ISO8601 time format (HH:MM:SS)
    pub notes: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateAgendaBlockCommand {
    pub id: i64,
    pub book_id: Option<i64>,
    pub scheduled_date: String, // ISO date format: YYYY-MM-DD
    pub start_time: Option<String>, // ISO8601 time format (HH:MM:SS)
    pub end_time: Option<String>,   // ISO8601 time format (HH:MM:SS)
    pub notes: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MarkBlockCompletedCommand {
    pub id: i64,
    pub session_id: i64,
}

impl From<AgendaBlock> for AgendaBlockDto {
    fn from(block: AgendaBlock) -> Self {
        AgendaBlockDto {
            id: block.id,
            book_id: block.book_id,
            scheduled_date: block.scheduled_date.format("%Y-%m-%d").to_string(),
            start_time: block.start_time,
            end_time: block.end_time,
            is_completed: block.is_completed,
            completed_session_id: block.completed_session_id,
            notes: block.notes,
            created_at: block.created_at.to_rfc3339(),
            updated_at: block.updated_at.to_rfc3339(),
        }
    }
}

impl TryFrom<CreateAgendaBlockCommand> for AgendaBlock {
    type Error = String;

    fn try_from(command: CreateAgendaBlockCommand) -> Result<Self, Self::Error> {
        let scheduled_date = chrono::NaiveDate::parse_from_str(&command.scheduled_date, "%Y-%m-%d")
            .map_err(|_| "Invalid date format. Expected YYYY-MM-DD".to_string())?;
        
        AgendaBlock::new(
            scheduled_date,
            command.book_id,
            command.start_time,
            command.end_time,
            command.notes,
        )
    }
}

impl TryFrom<UpdateAgendaBlockCommand> for AgendaBlock {
    type Error = String;

    fn try_from(command: UpdateAgendaBlockCommand) -> Result<Self, Self::Error> {
        let scheduled_date = chrono::NaiveDate::parse_from_str(&command.scheduled_date, "%Y-%m-%d")
            .map_err(|_| "Invalid date format. Expected YYYY-MM-DD".to_string())?;
        
        let now = chrono::Utc::now();
        let mut block = AgendaBlock {
            id: Some(command.id),
            book_id: command.book_id,
            scheduled_date,
            start_time: command.start_time.clone(),
            end_time: command.end_time.clone(),
            is_completed: false,
            completed_session_id: None,
            notes: command.notes.clone(),
            created_at: now, // Will be replaced by database value
            updated_at: now,
        };

        // Validate and set time
        block.update_time(command.start_time, command.end_time)?;
        
        Ok(block)
    }
}

