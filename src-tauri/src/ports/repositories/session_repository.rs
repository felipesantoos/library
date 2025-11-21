use crate::domain::entities::ReadingSession;

/// Repository trait for ReadingSession entity (Port/Interface)
pub trait SessionRepository: Send + Sync {
    /// Creates a new session
    fn create(&self, session: &mut ReadingSession) -> Result<(), String>;

    /// Updates an existing session
    fn update(&self, session: &ReadingSession) -> Result<(), String>;

    /// Deletes a session by ID
    fn delete(&self, id: i64) -> Result<(), String>;

    /// Finds a session by ID
    fn find_by_id(&self, id: i64) -> Result<Option<ReadingSession>, String>;

    /// Finds all sessions
    fn find_all(&self) -> Result<Vec<ReadingSession>, String>;

    /// Finds sessions by book ID
    fn find_by_book_id(&self, book_id: i64) -> Result<Vec<ReadingSession>, String>;

    /// Finds sessions by reading ID (for rereads)
    fn find_by_reading_id(&self, reading_id: i64) -> Result<Vec<ReadingSession>, String>;

    /// Finds sessions by date range
    fn find_by_date_range(
        &self,
        start_date: chrono::NaiveDate,
        end_date: chrono::NaiveDate,
    ) -> Result<Vec<ReadingSession>, String>;
}

