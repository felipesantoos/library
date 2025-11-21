use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc, NaiveDate};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgendaBlock {
    pub id: Option<i64>,
    pub book_id: Option<i64>,
    pub scheduled_date: NaiveDate,
    pub start_time: Option<String>, // ISO8601 time format (HH:MM:SS)
    pub end_time: Option<String>,   // ISO8601 time format (HH:MM:SS)
    pub is_completed: bool,
    pub completed_session_id: Option<i64>,
    pub notes: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl AgendaBlock {
    /// Creates a new AgendaBlock with validation
    pub fn new(
        scheduled_date: NaiveDate,
        book_id: Option<i64>,
        start_time: Option<String>,
        end_time: Option<String>,
        notes: Option<String>,
    ) -> Result<Self, String> {
        // Validate time format if provided
        if let Some(ref start) = start_time {
            if !is_valid_time_format(start) {
                return Err("Invalid start_time format. Expected HH:MM:SS or HH:MM".to_string());
            }
        }
        
        if let Some(ref end) = end_time {
            if !is_valid_time_format(end) {
                return Err("Invalid end_time format. Expected HH:MM:SS or HH:MM".to_string());
            }
        }

        // Validate time range if both are provided
        if let (Some(ref start), Some(ref end)) = (start_time.as_ref(), end_time.as_ref()) {
            if parse_time(start) >= parse_time(end) {
                return Err("End time must be after start time".to_string());
            }
        }

        let now = Utc::now();
        Ok(AgendaBlock {
            id: None,
            book_id,
            scheduled_date,
            start_time,
            end_time,
            is_completed: false,
            completed_session_id: None,
            notes,
            created_at: now,
            updated_at: now,
        })
    }

    /// Marks the block as completed and links it to a session
    pub fn mark_as_completed(&mut self, session_id: i64) {
        self.is_completed = true;
        self.completed_session_id = Some(session_id);
        self.updated_at = Utc::now();
    }

    /// Marks the block as not completed
    pub fn mark_as_not_completed(&mut self) {
        self.is_completed = false;
        self.completed_session_id = None;
        self.updated_at = Utc::now();
    }

    /// Updates the scheduled date
    pub fn update_date(&mut self, scheduled_date: NaiveDate) {
        self.scheduled_date = scheduled_date;
        self.updated_at = Utc::now();
    }

    /// Updates the time range
    pub fn update_time(&mut self, start_time: Option<String>, end_time: Option<String>) -> Result<(), String> {
        // Validate time format if provided
        if let Some(ref start) = start_time {
            if !is_valid_time_format(start) {
                return Err("Invalid start_time format. Expected HH:MM:SS or HH:MM".to_string());
            }
        }
        
        if let Some(ref end) = end_time {
            if !is_valid_time_format(end) {
                return Err("Invalid end_time format. Expected HH:MM:SS or HH:MM".to_string());
            }
        }

        // Validate time range if both are provided
        if let (Some(ref start), Some(ref end)) = (start_time.as_ref(), end_time.as_ref()) {
            if parse_time(start) >= parse_time(end) {
                return Err("End time must be after start time".to_string());
            }
        }

        self.start_time = start_time.clone();
        self.end_time = end_time.clone();
        self.updated_at = Utc::now();
        Ok(())
    }

    /// Updates the associated book
    pub fn update_book(&mut self, book_id: Option<i64>) {
        self.book_id = book_id;
        self.updated_at = Utc::now();
    }

    /// Updates the notes
    pub fn update_notes(&mut self, notes: Option<String>) {
        self.notes = notes;
        self.updated_at = Utc::now();
    }
}

fn is_valid_time_format(time: &str) -> bool {
    // Accepts both HH:MM:SS and HH:MM formats
    time.len() == 5 || time.len() == 8
}

fn parse_time(time: &str) -> u32 {
    // Simple parsing for comparison: HH:MM:SS or HH:MM
    let parts: Vec<&str> = time.split(':').collect();
    if parts.len() >= 2 {
        let hours: u32 = parts[0].parse().unwrap_or(0);
        let minutes: u32 = parts[1].parse().unwrap_or(0);
        hours * 60 + minutes // Convert to minutes for comparison
    } else {
        0
    }
}

