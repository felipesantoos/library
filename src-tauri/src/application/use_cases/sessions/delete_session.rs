use crate::ports::repositories::{SessionRepository, BookRepository};

/// Use case for deleting a session
pub struct DeleteSessionUseCase<'a> {
    session_repository: &'a dyn SessionRepository,
    book_repository: &'a dyn BookRepository,
}

impl<'a> DeleteSessionUseCase<'a> {
    pub fn new(
        session_repository: &'a dyn SessionRepository,
        book_repository: &'a dyn BookRepository,
    ) -> Self {
        DeleteSessionUseCase {
            session_repository,
            book_repository,
        }
    }

    pub fn execute(&self, id: i64) -> Result<(), String> {
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
            // If no sessions with end_page, reset to 0
            book.update_current_page(0)?;
        }

        // Update current_minutes_audio
        book.update_current_minutes_audio(total_minutes)?;

        // Save the book
        self.book_repository.update(&book)?;

        Ok(())
    }
}

