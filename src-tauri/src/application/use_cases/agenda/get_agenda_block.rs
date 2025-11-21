use crate::application::dtos::agenda_block_dto::AgendaBlockDto;
use crate::ports::repositories::agenda_repository::AgendaRepository;

pub struct GetAgendaBlockUseCase<'a> {
    agenda_repository: &'a dyn AgendaRepository,
}

impl<'a> GetAgendaBlockUseCase<'a> {
    pub fn new(agenda_repository: &'a dyn AgendaRepository) -> Self {
        GetAgendaBlockUseCase { agenda_repository }
    }

    pub fn execute(&self, id: i64) -> Result<AgendaBlockDto, String> {
        let block = self.agenda_repository.find_by_id(id)?
            .ok_or_else(|| format!("Agenda block with id {} not found", id))?;
        Ok(block.into())
    }
}

