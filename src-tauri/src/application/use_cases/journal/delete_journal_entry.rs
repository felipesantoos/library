use crate::ports::repositories::journal_repository::JournalRepository;

pub struct DeleteJournalEntryUseCase<'a> {
    journal_repository: &'a dyn JournalRepository,
}

impl<'a> DeleteJournalEntryUseCase<'a> {
    pub fn new(journal_repository: &'a dyn JournalRepository) -> Self {
        DeleteJournalEntryUseCase { journal_repository }
    }

    pub fn execute(&self, id: i64) -> Result<(), String> {
        // Check if entry exists
        self.journal_repository.find_by_id(id)?
            .ok_or_else(|| format!("Journal entry with id {} not found", id))?;

        self.journal_repository.delete(id)?;
        Ok(())
    }
}

