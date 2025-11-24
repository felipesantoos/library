use crate::core::domains::journal_entry::JournalEntry;
use chrono::NaiveDate;

/// Repository trait for journal entries
pub trait JournalRepository: Send + Sync {
    /// Create a new journal entry
    fn create(&self, entry: &JournalEntry) -> Result<JournalEntry, String>;

    /// Update an existing journal entry
    fn update(&self, entry: &JournalEntry) -> Result<JournalEntry, String>;

    /// Delete a journal entry by ID
    fn delete(&self, id: i64) -> Result<(), String>;

    /// Find a journal entry by ID
    fn find_by_id(&self, id: i64) -> Result<Option<JournalEntry>, String>;

    /// Find all journal entries, optionally filtered
    fn find_all(
        &self,
        book_id: Option<i64>,
        start_date: Option<NaiveDate>,
        end_date: Option<NaiveDate>,
    ) -> Result<Vec<JournalEntry>, String>;

    /// Find journal entries by book ID
    fn find_by_book_id(&self, book_id: i64) -> Result<Vec<JournalEntry>, String>;

    /// Find journal entries by date range
    fn find_by_date_range(
        &self,
        start_date: NaiveDate,
        end_date: NaiveDate,
    ) -> Result<Vec<JournalEntry>, String>;
}

