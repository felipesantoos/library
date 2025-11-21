use crate::application::dtos::journal_entry_dto::JournalEntryDto;
use crate::ports::repositories::journal_repository::JournalRepository;

pub struct GetJournalEntryUseCase<'a> {
    journal_repository: &'a dyn JournalRepository,
}

impl<'a> GetJournalEntryUseCase<'a> {
    pub fn new(journal_repository: &'a dyn JournalRepository) -> Self {
        GetJournalEntryUseCase { journal_repository }
    }

    pub fn execute(&self, id: i64) -> Result<JournalEntryDto, String> {
        let entry = self.journal_repository.find_by_id(id)?
            .ok_or_else(|| format!("Journal entry with id {} not found", id))?;
        Ok(entry.into())
    }
}

