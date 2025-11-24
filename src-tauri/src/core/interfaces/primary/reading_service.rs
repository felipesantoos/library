use crate::app::dtos::reading_dto::{ReadingDto, CreateReadingCommand, ListReadingsFilters};

/// Primary interface for reading service operations
pub trait ReadingService: Send + Sync {
    fn create(&self, command: CreateReadingCommand) -> Result<ReadingDto, String>;
    fn get(&self, id: i64) -> Result<ReadingDto, String>;
    fn get_current(&self, book_id: i64) -> Result<Option<ReadingDto>, String>;
    fn list(&self, filters: ListReadingsFilters) -> Result<Vec<ReadingDto>, String>;
}

