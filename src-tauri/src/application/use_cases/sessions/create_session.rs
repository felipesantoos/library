use crate::domain::entities::ReadingSession;
use crate::application::dtos::{SessionDto, CreateSessionCommand};
use crate::ports::repositories::{SessionRepository, BookRepository};

/// Use case for creating a new reading session
pub struct CreateSessionUseCase<'a> {
    session_repository: &'a dyn SessionRepository,
    book_repository: &'a dyn BookRepository,
}

impl<'a> CreateSessionUseCase<'a> {
    pub fn new(
        session_repository: &'a dyn SessionRepository,
        book_repository: &'a dyn BookRepository,
    ) -> Self {
        CreateSessionUseCase {
            session_repository,
            book_repository,
        }
    }

    pub fn execute(&self, command: CreateSessionCommand) -> Result<SessionDto, String> {
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

        // Update book progress (if pages/minutes were read)
        if let Some(pages) = session.pages_read {
            if pages > 0 {
                self.update_book_progress(&session)?;
            }
        } else if let Some(minutes) = session.minutes_read {
            if minutes > 0 {
                self.update_book_progress_audio(&session)?;
            }
        }

        // Convert to DTO and return
        Ok(SessionDto::from(session))
    }

    fn update_book_progress(&self, session: &ReadingSession) -> Result<(), String> {
        let mut book = self.book_repository
            .find_by_id(session.book_id)?
            .ok_or_else(|| "Book not found".to_string())?;

        // Always update last page read with the end page of the section
        if let Some(end_page) = session.end_page {
            book.update_current_page(end_page)?;
            self.book_repository.update(&book)?;
        }

        Ok(())
    }

    fn update_book_progress_audio(&self, session: &ReadingSession) -> Result<(), String> {
        let mut book = self.book_repository
            .find_by_id(session.book_id)?
            .ok_or_else(|| "Book not found".to_string())?;

        if let Some(minutes) = session.minutes_read {
            let new_total = book.current_minutes_audio + minutes;
            book.update_current_minutes_audio(new_total)?;
            self.book_repository.update(&book)?;
        }

        Ok(())
    }
}

