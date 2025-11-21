use crate::domain::entities::reading::Reading;

/// Repository trait for book readings (rereads)
pub trait ReadingRepository {
    /// Create a new reading cycle
    fn create(&self, reading: &Reading) -> Result<Reading, String>;

    /// Update an existing reading
    fn update(&self, reading: &Reading) -> Result<Reading, String>;

    /// Delete a reading by ID
    fn delete(&self, id: i64) -> Result<(), String>;

    /// Find a reading by ID
    fn find_by_id(&self, id: i64) -> Result<Option<Reading>, String>;

    /// Find all readings for a book
    fn find_by_book_id(&self, book_id: i64) -> Result<Vec<Reading>, String>;

    /// Find the current active reading for a book (status = 'reading' or 'rereading')
    fn find_current_reading(&self, book_id: i64) -> Result<Option<Reading>, String>;

    /// Get the next reading number for a book (highest reading_number + 1)
    fn get_next_reading_number(&self, book_id: i64) -> Result<i32, String>;
}

