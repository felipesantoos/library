use crate::application::dtos::{SessionDto, UpdateSessionCommand};
use crate::ports::repositories::{SessionRepository, BookRepository};

/// Use case for updating an existing reading session
pub struct UpdateSessionUseCase<'a> {
    session_repository: &'a dyn SessionRepository,
    book_repository: &'a dyn BookRepository,
}

impl<'a> UpdateSessionUseCase<'a> {
    pub fn new(
        session_repository: &'a dyn SessionRepository,
        book_repository: &'a dyn BookRepository,
    ) -> Self {
        UpdateSessionUseCase {
            session_repository,
            book_repository,
        }
    }

    pub fn execute(&self, command: UpdateSessionCommand) -> Result<SessionDto, String> {
        // Get existing session
        let mut session = self.session_repository
            .find_by_id(command.id)?
            .ok_or_else(|| format!("Session with id {} not found", command.id))?;

        // Update fields if provided
        if let Some(session_date_str) = command.session_date {
            session.session_date = chrono::NaiveDate::parse_from_str(&session_date_str, "%Y-%m-%d")
                .map_err(|e| format!("Invalid date format: {}. Expected YYYY-MM-DD", e))?;
        }

        if let Some(start_time_str) = command.start_time {
            session.start_time = if start_time_str.is_empty() {
                None
            } else {
                chrono::NaiveTime::parse_from_str(&start_time_str, "%H:%M:%S").ok()
            };
        }

        if let Some(end_time_str) = command.end_time {
            session.end_time = if end_time_str.is_empty() {
                None
            } else {
                chrono::NaiveTime::parse_from_str(&end_time_str, "%H:%M:%S").ok()
            };
        }

        if let Some(start_page) = command.start_page {
            session.start_page = Some(start_page);
        }

        if let Some(end_page) = command.end_page {
            session.end_page = Some(end_page);
        }

        if let Some(minutes_read) = command.minutes_read {
            session.minutes_read = Some(minutes_read);
        }

        if let Some(notes) = command.notes {
            session.notes = if notes.is_empty() {
                None
            } else {
                Some(notes)
            };
        }

        // Recalculate pages_read if start/end page changed
        if session.start_page.is_some() && session.end_page.is_some() {
            session.update_pages_read()?;
        }

        // Recalculate duration if times changed
        if session.start_time.is_some() && session.end_time.is_some() {
            session.calculate_duration();
        }

        // Update timestamp
        session.updated_at = chrono::Utc::now();

        // Save via repository
        self.session_repository.update(&session)?;

        // Recalculate book progress (this is a simplified approach)
        // In a more robust system, we'd recalculate from all sessions
        if let Some(end_page) = session.end_page {
            let mut book = self.book_repository
                .find_by_id(session.book_id)?
                .ok_or_else(|| "Book not found".to_string())?;

            if book.current_page_text < end_page {
                book.update_current_page(end_page)?;
                self.book_repository.update(&book)?;
            }
        }

        // Convert to DTO and return
        Ok(SessionDto::from(session))
    }
}

