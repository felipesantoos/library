use crate::application::dtos::journal_entry_dto::{CreateJournalEntryCommand, JournalEntryDto};
use crate::domain::entities::journal_entry::JournalEntry;
use crate::ports::repositories::journal_repository::JournalRepository;

pub struct CreateJournalEntryUseCase<'a> {
    journal_repository: &'a dyn JournalRepository,
}

impl<'a> CreateJournalEntryUseCase<'a> {
    pub fn new(journal_repository: &'a dyn JournalRepository) -> Self {
        CreateJournalEntryUseCase { journal_repository }
    }

    pub fn execute(&self, command: CreateJournalEntryCommand) -> Result<JournalEntryDto, String> {
        let entry: JournalEntry = command.try_into()?;
        let created = self.journal_repository.create(&entry)?;
        Ok(created.into())
    }
}

