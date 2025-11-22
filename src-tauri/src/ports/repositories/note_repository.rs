use crate::domain::entities::Note;

/// Repository trait for Note entity (Port/Interface)
pub trait NoteRepository: Send + Sync {
    /// Creates a new note
    fn create(&self, note: &mut Note) -> Result<(), String>;

    /// Updates an existing note
    fn update(&self, note: &Note) -> Result<(), String>;

    /// Deletes a note by ID
    fn delete(&self, id: i64) -> Result<(), String>;

    /// Finds a note by ID
    fn find_by_id(&self, id: i64) -> Result<Option<Note>, String>;

    /// Finds all notes
    fn find_all(&self) -> Result<Vec<Note>, String>;

    /// Finds notes by book ID
    fn find_by_book_id(&self, book_id: i64) -> Result<Vec<Note>, String>;

    /// Finds notes by reading ID (for rereads)
    fn find_by_reading_id(&self, reading_id: i64) -> Result<Vec<Note>, String>;

    /// Searches notes by content
    fn search_by_content(&self, query: &str) -> Result<Vec<Note>, String>;
}

