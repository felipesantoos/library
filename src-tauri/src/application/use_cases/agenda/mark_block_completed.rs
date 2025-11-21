use crate::application::dtos::agenda_block_dto::{MarkBlockCompletedCommand, AgendaBlockDto};
use crate::domain::entities::agenda_block::AgendaBlock;
use crate::ports::repositories::agenda_repository::AgendaRepository;

pub struct MarkBlockCompletedUseCase<'a> {
    agenda_repository: &'a dyn AgendaRepository,
}

impl<'a> MarkBlockCompletedUseCase<'a> {
    pub fn new(agenda_repository: &'a dyn AgendaRepository) -> Self {
        MarkBlockCompletedUseCase { agenda_repository }
    }

    pub fn execute(&self, command: MarkBlockCompletedCommand) -> Result<AgendaBlockDto, String> {
        let mut block = self.agenda_repository.find_by_id(command.id)?
            .ok_or_else(|| format!("Agenda block with id {} not found", command.id))?;

        block.mark_as_completed(command.session_id);
        let updated = self.agenda_repository.update(&block)?;
        Ok(updated.into())
    }
}

