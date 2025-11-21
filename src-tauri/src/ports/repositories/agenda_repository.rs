use crate::domain::entities::agenda_block::AgendaBlock;
use chrono::NaiveDate;

/// Repository trait for agenda blocks
pub trait AgendaRepository {
    /// Create a new agenda block
    fn create(&self, block: &AgendaBlock) -> Result<AgendaBlock, String>;

    /// Update an existing agenda block
    fn update(&self, block: &AgendaBlock) -> Result<AgendaBlock, String>;

    /// Delete an agenda block by ID
    fn delete(&self, id: i64) -> Result<(), String>;

    /// Find an agenda block by ID
    fn find_by_id(&self, id: i64) -> Result<Option<AgendaBlock>, String>;

    /// Find all agenda blocks, optionally filtered
    fn find_all(
        &self,
        book_id: Option<i64>,
        start_date: Option<NaiveDate>,
        end_date: Option<NaiveDate>,
        is_completed: Option<bool>,
    ) -> Result<Vec<AgendaBlock>, String>;

    /// Find agenda blocks by book ID
    fn find_by_book_id(&self, book_id: i64) -> Result<Vec<AgendaBlock>, String>;

    /// Find agenda blocks by date range
    fn find_by_date_range(
        &self,
        start_date: NaiveDate,
        end_date: NaiveDate,
    ) -> Result<Vec<AgendaBlock>, String>;

    /// Find agenda blocks by specific date
    fn find_by_date(&self, date: NaiveDate) -> Result<Vec<AgendaBlock>, String>;
}

