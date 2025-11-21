use crate::application::dtos::agenda_block_dto::{CreateAgendaBlockCommand, AgendaBlockDto};
use crate::domain::entities::agenda_block::AgendaBlock;
use crate::ports::repositories::agenda_repository::AgendaRepository;

pub struct CreateAgendaBlockUseCase<'a> {
    agenda_repository: &'a dyn AgendaRepository,
}

impl<'a> CreateAgendaBlockUseCase<'a> {
    pub fn new(agenda_repository: &'a dyn AgendaRepository) -> Self {
        CreateAgendaBlockUseCase { agenda_repository }
    }

    pub fn execute(&self, command: CreateAgendaBlockCommand) -> Result<AgendaBlockDto, String> {
        let block: AgendaBlock = command.try_into()?;
        let created = self.agenda_repository.create(&block)?;
        Ok(created.into())
    }
}

