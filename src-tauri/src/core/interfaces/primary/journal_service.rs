use crate::app::dtos::journal_entry_dto::{
    JournalEntryDto, CreateJournalEntryCommand, UpdateJournalEntryCommand,
};

/// Primary interface for journal service operations
pub trait JournalService: Send + Sync {
    fn create(&self, command: CreateJournalEntryCommand) -> Result<JournalEntryDto, String>;
    fn update(&self, command: UpdateJournalEntryCommand) -> Result<JournalEntryDto, String>;
    fn delete(&self, id: i64) -> Result<(), String>;
    fn get(&self, id: i64) -> Result<JournalEntryDto, String>;
    fn list(
        &self,
        start_date: Option<String>,
        end_date: Option<String>,
        book_id: Option<i64>,
    ) -> Result<Vec<JournalEntryDto>, String>;
}

