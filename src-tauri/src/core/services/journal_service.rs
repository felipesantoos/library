use crate::app::dtos::journal_entry_dto::{
    JournalEntryDto, CreateJournalEntryCommand, UpdateJournalEntryCommand, ListJournalEntriesFilters,
};
use crate::core::domains::journal_entry::JournalEntry;
use crate::core::interfaces::primary::JournalService;
use crate::core::interfaces::secondary::journal_repository::JournalRepository;
use chrono::NaiveDate;

/// Implementation of JournalService
pub struct JournalServiceImpl<'a> {
    journal_repository: &'a dyn JournalRepository,
}

impl<'a> JournalServiceImpl<'a> {
    pub fn new(journal_repository: &'a dyn JournalRepository) -> Self {
        JournalServiceImpl { journal_repository }
    }
}

impl<'a> JournalService for JournalServiceImpl<'a> {
    fn create(&self, command: CreateJournalEntryCommand) -> Result<JournalEntryDto, String> {
        let entry: JournalEntry = command.try_into()?;
        let created = self.journal_repository.create(&entry)?;
        Ok(created.into())
    }

    fn update(&self, command: UpdateJournalEntryCommand) -> Result<JournalEntryDto, String> {
        // Check if entry exists
        let existing = self.journal_repository.find_by_id(command.id)?
            .ok_or_else(|| format!("Journal entry with id {} not found", command.id))?;

        // Create updated entry from command
        let mut entry: JournalEntry = command.try_into()?;
        
        // Preserve created_at from existing entry
        entry.created_at = existing.created_at;

        let updated = self.journal_repository.update(&entry)?;
        Ok(updated.into())
    }

    fn delete(&self, id: i64) -> Result<(), String> {
        // Check if entry exists
        self.journal_repository.find_by_id(id)?
            .ok_or_else(|| format!("Journal entry with id {} not found", id))?;

        self.journal_repository.delete(id)?;
        Ok(())
    }

    fn get(&self, id: i64) -> Result<JournalEntryDto, String> {
        let entry = self.journal_repository.find_by_id(id)?
            .ok_or_else(|| format!("Journal entry with id {} not found", id))?;
        Ok(entry.into())
    }

    fn list(&self, filters: ListJournalEntriesFilters) -> Result<Vec<JournalEntryDto>, String> {
        let start_date_parsed = filters.start_date
            .map(|d| NaiveDate::parse_from_str(&d, "%Y-%m-%d"))
            .transpose()
            .map_err(|_| "Invalid start_date format. Expected YYYY-MM-DD".to_string())?;

        let end_date_parsed = filters.end_date
            .map(|d| NaiveDate::parse_from_str(&d, "%Y-%m-%d"))
            .transpose()
            .map_err(|_| "Invalid end_date format. Expected YYYY-MM-DD".to_string())?;

        let entries = self.journal_repository.find_all(
            filters.book_id,
            start_date_parsed,
            end_date_parsed,
        )?;

        Ok(entries.into_iter().map(|e| e.into()).collect())
    }
}

