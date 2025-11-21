use crate::application::dtos::journal_entry_dto::JournalEntryDto;
use crate::domain::entities::journal_entry::JournalEntry;
use crate::ports::repositories::journal_repository::JournalRepository;
use chrono::NaiveDate;

pub struct ListJournalEntriesUseCase<'a> {
    journal_repository: &'a dyn JournalRepository,
}

impl<'a> ListJournalEntriesUseCase<'a> {
    pub fn new(journal_repository: &'a dyn JournalRepository) -> Self {
        ListJournalEntriesUseCase { journal_repository }
    }

    pub fn execute(
        &self,
        book_id: Option<i64>,
        start_date: Option<String>,
        end_date: Option<String>,
    ) -> Result<Vec<JournalEntryDto>, String> {
        let start_date_parsed = start_date
            .map(|d| NaiveDate::parse_from_str(&d, "%Y-%m-%d"))
            .transpose()
            .map_err(|_| "Invalid start_date format. Expected YYYY-MM-DD".to_string())?;

        let end_date_parsed = end_date
            .map(|d| NaiveDate::parse_from_str(&d, "%Y-%m-%d"))
            .transpose()
            .map_err(|_| "Invalid end_date format. Expected YYYY-MM-DD".to_string())?;

        let entries = self.journal_repository.find_all(
            book_id,
            start_date_parsed,
            end_date_parsed,
        )?;

        Ok(entries.into_iter().map(|e| e.into()).collect())
    }
}

