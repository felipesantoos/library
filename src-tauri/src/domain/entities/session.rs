use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReadingSession {
    pub id: Option<i64>,
    pub book_id: i64,
    pub reading_id: Option<i64>, // For rereads
    pub session_date: chrono::NaiveDate,
    pub start_time: Option<chrono::NaiveTime>,
    pub end_time: Option<chrono::NaiveTime>,
    pub start_page: Option<i32>,
    pub end_page: Option<i32>,
    pub pages_read: Option<i32>,
    pub minutes_read: Option<i32>,
    pub duration_seconds: Option<i32>,
    pub photo_path: Option<String>,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub updated_at: chrono::DateTime<chrono::Utc>,
}

impl ReadingSession {
    /// Creates a new ReadingSession with validation
    pub fn new(
        book_id: i64,
        session_date: chrono::NaiveDate,
        start_page: Option<i32>,
        end_page: Option<i32>,
    ) -> Result<Self, String> {
        // Validate that end_page >= start_page
        if let (Some(start), Some(end)) = (start_page, end_page) {
            if end < start {
                return Err(format!(
                    "End page ({}) cannot be less than start page ({})",
                    end, start
                ));
            }
            if start < 0 || end < 0 {
                return Err("Page numbers cannot be negative".to_string());
            }
        }

        let pages_read = if let (Some(start), Some(end)) = (start_page, end_page) {
            Some(end - start)
        } else {
            None
        };

        Ok(ReadingSession {
            id: None,
            book_id,
            reading_id: None,
            session_date,
            start_time: None,
            end_time: None,
            start_page,
            end_page,
            pages_read,
            minutes_read: None,
            duration_seconds: None,
            photo_path: None,
            created_at: chrono::Utc::now(),
            updated_at: chrono::Utc::now(),
        })
    }

    /// Calculates duration in seconds from start and end times
    pub fn calculate_duration(&mut self) {
        if let (Some(start), Some(end)) = (self.start_time, self.end_time) {
            let start_datetime = chrono::NaiveDateTime::new(self.session_date, start);
            let end_datetime = chrono::NaiveDateTime::new(self.session_date, end);
            
            if let Ok(duration) = end_datetime.signed_duration_since(start_datetime).to_std() {
                self.duration_seconds = Some(duration.as_secs() as i32);
            }
        }
    }

    /// Updates pages read based on start and end page
    pub fn update_pages_read(&mut self) -> Result<(), String> {
        if let (Some(start), Some(end)) = (self.start_page, self.end_page) {
            if end < start {
                return Err(format!(
                    "End page ({}) cannot be less than start page ({})",
                    end, start
                ));
            }
            self.pages_read = Some(end - start);
        }
        Ok(())
    }
}

