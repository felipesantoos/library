use crate::application::dtos::journal_entry_dto::{UpdateJournalEntryCommand, JournalEntryDto};
use crate::domain::entities::journal_entry::JournalEntry;
use crate::ports::repositories::journal_repository::JournalRepository;

pub struct UpdateJournalEntryUseCase<'a> {
    journal_repository: &'a dyn JournalRepository,
}

impl<'a> UpdateJournalEntryUseCase<'a> {
    pub fn new(journal_repository: &'a dyn JournalRepository) -> Self {
        UpdateJournalEntryUseCase { journal_repository }
    }

    pub fn execute(&self, command: UpdateJournalEntryCommand) -> Result<JournalEntryDto, String> {
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
}

