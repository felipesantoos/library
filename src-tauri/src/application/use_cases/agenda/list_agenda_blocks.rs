use crate::application::dtos::agenda_block_dto::AgendaBlockDto;
use crate::domain::entities::agenda_block::AgendaBlock;
use crate::ports::repositories::agenda_repository::AgendaRepository;
use chrono::NaiveDate;

pub struct ListAgendaBlocksUseCase<'a> {
    agenda_repository: &'a dyn AgendaRepository,
}

impl<'a> ListAgendaBlocksUseCase<'a> {
    pub fn new(agenda_repository: &'a dyn AgendaRepository) -> Self {
        ListAgendaBlocksUseCase { agenda_repository }
    }

    pub fn execute(
        &self,
        book_id: Option<i64>,
        start_date: Option<String>,
        end_date: Option<String>,
        is_completed: Option<bool>,
    ) -> Result<Vec<AgendaBlockDto>, String> {
        let start_date_parsed = start_date
            .map(|d| NaiveDate::parse_from_str(&d, "%Y-%m-%d"))
            .transpose()
            .map_err(|_| "Invalid start_date format. Expected YYYY-MM-DD".to_string())?;

        let end_date_parsed = end_date
            .map(|d| NaiveDate::parse_from_str(&d, "%Y-%m-%d"))
            .transpose()
            .map_err(|_| "Invalid end_date format. Expected YYYY-MM-DD".to_string())?;

        let blocks = self.agenda_repository.find_all(
            book_id,
            start_date_parsed,
            end_date_parsed,
            is_completed,
        )?;

        Ok(blocks.into_iter().map(|b| b.into()).collect())
    }
}

