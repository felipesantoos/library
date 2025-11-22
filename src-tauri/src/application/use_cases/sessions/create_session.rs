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

        // Recalculate book progress based on all sessions
        self.recalculate_book_progress(session.book_id)?;

        // Convert to DTO and return
        Ok(SessionDto::from(session))
    }

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
        }

        // Update current_minutes_audio
        if total_minutes > 0 {
            book.update_current_minutes_audio(total_minutes)?;
        }

        // Save the book
        self.book_repository.update(&book)?;

        Ok(())
    }
}

