use crate::app::dtos::{SessionDto, CreateSessionCommand, UpdateSessionCommand};
use crate::core::domains::session::ReadingSession;
use crate::core::interfaces::primary::SessionService;
use crate::core::interfaces::secondary::{SessionRepository, BookRepository};

/// Implementation of SessionService
pub struct SessionServiceImpl<'a> {
    session_repository: &'a dyn SessionRepository,
    book_repository: &'a dyn BookRepository,
}

impl<'a> SessionServiceImpl<'a> {
    pub fn new(
        session_repository: &'a dyn SessionRepository,
        book_repository: &'a dyn BookRepository,
    ) -> Self {
        SessionServiceImpl {
            session_repository,
            book_repository,
        }
    }
}

impl<'a> SessionService for SessionServiceImpl<'a> {
    fn create(&self, command: CreateSessionCommand) -> Result<SessionDto, String> {
        // Validate book exists
        self.book_repository
            .find_by_id(command.book_id)?
            .ok_or_else(|| format!("Book with id {} not found", command.book_id))?;

        // Parse session date
        let session_date = chrono::NaiveDate::parse_from_str(&command.session_date, "%Y-%m-%d")
            .map_err(|e| format!("Invalid date format: {}. Expected YYYY-MM-DD", e))?;

        // Parse times if provided
        let start_time = command.start_time
            .as_ref()
            .and_then(|s| chrono::NaiveTime::parse_from_str(s, "%H:%M:%S").ok());
        let end_time = command.end_time
            .as_ref()
            .and_then(|s| chrono::NaiveTime::parse_from_str(s, "%H:%M:%S").ok());

        // Create session entity with validation
        let mut session = ReadingSession::new(
            command.book_id,
            session_date,
            command.start_page,
            command.end_page,
        )?;

        // Set optional fields
        session.reading_id = command.reading_id;
        session.start_time = start_time;
        session.end_time = end_time;
        session.minutes_read = command.minutes_read;

        // Calculate duration if times are provided
        if start_time.is_some() && end_time.is_some() {
            session.calculate_duration();
        }

        // Update pages read based on start/end page
        session.update_pages_read()?;

        // Save via repository
        self.session_repository.create(&mut session)?;

        // Recalculate book progress based on all sessions
        self.recalculate_book_progress(session.book_id)?;

        // Convert to DTO and return
        Ok(SessionDto::from(session))
    }

    fn update(&self, command: UpdateSessionCommand) -> Result<SessionDto, String> {
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

        // Recalculate book progress based on all sessions
        self.recalculate_book_progress(session.book_id)?;

        // Convert to DTO and return
        Ok(SessionDto::from(session))
    }

    fn delete(&self, id: i64) -> Result<(), String> {
        // Get session to find book_id before deleting
        let session = self.session_repository
            .find_by_id(id)?
            .ok_or_else(|| format!("Session with id {} not found", id))?;

        let book_id = session.book_id;

        // Delete via repository
        self.session_repository.delete(id)?;

        // Recalculate book progress based on remaining sessions
        self.recalculate_book_progress(book_id)?;

        Ok(())
    }

    fn get(&self, id: i64) -> Result<SessionDto, String> {
        let session = self.session_repository
            .find_by_id(id)?
            .ok_or_else(|| format!("Session with id {} not found", id))?;

        Ok(SessionDto::from(session))
    }

    fn list(
        &self,
        book_id: Option<i64>,
        start_date: Option<String>,
        end_date: Option<String>,
    ) -> Result<Vec<SessionDto>, String> {
        let sessions = match (book_id, start_date, end_date) {
            // Filter by book AND date range
            (Some(b_id), Some(start), Some(end)) => {
                let start_date = chrono::NaiveDate::parse_from_str(&start, "%Y-%m-%d")
                    .map_err(|e| format!("Invalid start date: {}", e))?;
                let end_date = chrono::NaiveDate::parse_from_str(&end, "%Y-%m-%d")
                    .map_err(|e| format!("Invalid end date: {}", e))?;
                self.session_repository.find_by_book_id_and_date_range(b_id, start_date, end_date)?
            }
            // Filter by book only
            (Some(b_id), _, _) => {
                self.session_repository.find_by_book_id(b_id)?
            }
            // Filter by date range only
            (None, Some(start), Some(end)) => {
                let start_date = chrono::NaiveDate::parse_from_str(&start, "%Y-%m-%d")
                    .map_err(|e| format!("Invalid start date: {}", e))?;
                let end_date = chrono::NaiveDate::parse_from_str(&end, "%Y-%m-%d")
                    .map_err(|e| format!("Invalid end date: {}", e))?;
                self.session_repository.find_by_date_range(start_date, end_date)?
            }
            // Get all sessions
            _ => {
                self.session_repository.find_all()?
            }
        };

        Ok(sessions.into_iter().map(SessionDto::from).collect())
    }
}

impl<'a> SessionServiceImpl<'a> {
    /// Recalculates book progress based on all sessions for the book
    /// Sets current_page_text to the end_page of the most recent session
    /// Sets current_minutes_audio to the sum of all minutes_read from all sessions
    fn recalculate_book_progress(&self, book_id: i64) -> Result<(), String> {
        let mut book = self.book_repository
            .find_by_id(book_id)?
            .ok_or_else(|| "Book not found".to_string())?;

        // Get all sessions for this book
        let mut sessions = self.session_repository.find_by_book_id(book_id)?;

        // Sort sessions by date (most recent first), then by created_at if dates are equal
        sessions.sort_by(|a, b| {
            let date_cmp = b.session_date.cmp(&a.session_date);
            if date_cmp == std::cmp::Ordering::Equal {
                b.created_at.cmp(&a.created_at)
            } else {
                date_cmp
            }
        });

        // Get end_page from the most recent session
        let last_end_page = sessions
            .iter()
            .find_map(|s| s.end_page);

        // Sum all minutes_read from all sessions
        let total_minutes: i32 = sessions
            .iter()
            .filter_map(|s| s.minutes_read)
            .sum();

        // Update current_page_text with the end_page of the most recent session
        if let Some(last_page) = last_end_page {
            book.update_current_page(last_page)?;
        } else {
            // If no sessions with end_page, reset to 0 (for delete case)
            if sessions.is_empty() {
                book.update_current_page(0)?;
            }
        }

        // Update current_minutes_audio
        book.update_current_minutes_audio(total_minutes)?;

        // Save the book
        self.book_repository.update(&book)?;

        Ok(())
    }
}

