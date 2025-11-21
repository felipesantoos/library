use crate::application::dtos::agenda_block_dto::{UpdateAgendaBlockCommand, AgendaBlockDto};
use crate::domain::entities::agenda_block::AgendaBlock;
use crate::ports::repositories::agenda_repository::AgendaRepository;

pub struct UpdateAgendaBlockUseCase<'a> {
    agenda_repository: &'a dyn AgendaRepository,
}

impl<'a> UpdateAgendaBlockUseCase<'a> {
    pub fn new(agenda_repository: &'a dyn AgendaRepository) -> Self {
        UpdateAgendaBlockUseCase { agenda_repository }
    }

    pub fn execute(&self, command: UpdateAgendaBlockCommand) -> Result<AgendaBlockDto, String> {
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
}

