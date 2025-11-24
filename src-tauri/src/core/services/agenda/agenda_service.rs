use crate::app::dtos::agenda_block_dto::{
    CreateAgendaBlockCommand, UpdateAgendaBlockCommand, MarkBlockCompletedCommand, AgendaBlockDto,
};
use crate::core::domains::agenda_block::AgendaBlock;
use crate::core::filters::AgendaBlockFilters;
use crate::core::interfaces::primary::AgendaService;
use crate::core::interfaces::secondary::agenda_repository::AgendaRepository;

/// Implementation of AgendaService
pub struct AgendaServiceImpl<'a> {
    agenda_repository: &'a dyn AgendaRepository,
}

impl<'a> AgendaServiceImpl<'a> {
    pub fn new(agenda_repository: &'a dyn AgendaRepository) -> Self {
        AgendaServiceImpl { agenda_repository }
    }
}

impl<'a> AgendaService for AgendaServiceImpl<'a> {
    fn create(&self, command: CreateAgendaBlockCommand) -> Result<AgendaBlockDto, String> {
        let block: AgendaBlock = command.try_into()?;
        let created = self.agenda_repository.create(&block)?;
        Ok(created.into())
    }

    fn update(&self, command: UpdateAgendaBlockCommand) -> Result<AgendaBlockDto, String> {
        // Check if block exists
        let existing = self.agenda_repository.find_by_id(command.id)?
            .ok_or_else(|| format!("Agenda block with id {} not found", command.id))?;

        // Create updated block from command
        let mut block: AgendaBlock = command.try_into()?;
        
        // Preserve created_at and completion status from existing block
        block.created_at = existing.created_at;
        block.is_completed = existing.is_completed;
        block.completed_session_id = existing.completed_session_id;

        let updated = self.agenda_repository.update(&block)?;
        Ok(updated.into())
    }

    fn delete(&self, id: i64) -> Result<(), String> {
        // Check if block exists
        self.agenda_repository.find_by_id(id)?
            .ok_or_else(|| format!("Agenda block with id {} not found", id))?;

        self.agenda_repository.delete(id)?;
        Ok(())
    }

    fn get(&self, id: i64) -> Result<AgendaBlockDto, String> {
        let block = self.agenda_repository.find_by_id(id)?
            .ok_or_else(|| format!("Agenda block with id {} not found", id))?;
        Ok(block.into())
    }

    fn list(
        &self,
        book_id: Option<i64>,
        start_date: Option<String>,
        end_date: Option<String>,
        is_completed: Option<bool>,
    ) -> Result<Vec<AgendaBlockDto>, String> {
        let start_date_parsed = start_date
            .map(|d| chrono::NaiveDate::parse_from_str(&d, "%Y-%m-%d"))
            .transpose()
            .map_err(|_| "Invalid start_date format. Expected YYYY-MM-DD".to_string())?;

        let end_date_parsed = end_date
            .map(|d| chrono::NaiveDate::parse_from_str(&d, "%Y-%m-%d"))
            .transpose()
            .map_err(|_| "Invalid end_date format. Expected YYYY-MM-DD".to_string())?;

        let filters = AgendaBlockFilters {
            book_id,
            start_date: start_date_parsed,
            end_date: end_date_parsed,
            is_completed,
        };

        let blocks = self.agenda_repository.find_all(&filters)?;

        Ok(blocks.into_iter().map(|b| b.into()).collect())
    }

    fn mark_completed(&self, command: MarkBlockCompletedCommand) -> Result<AgendaBlockDto, String> {
        let mut block = self.agenda_repository.find_by_id(command.id)?
            .ok_or_else(|| format!("Agenda block with id {} not found", command.id))?;

        block.mark_as_completed(command.session_id);
        let updated = self.agenda_repository.update(&block)?;
        Ok(updated.into())
    }
}

