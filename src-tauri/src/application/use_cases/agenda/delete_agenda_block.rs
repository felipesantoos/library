use crate::ports::repositories::agenda_repository::AgendaRepository;

pub struct DeleteAgendaBlockUseCase<'a> {
    agenda_repository: &'a dyn AgendaRepository,
}

impl<'a> DeleteAgendaBlockUseCase<'a> {
    pub fn new(agenda_repository: &'a dyn AgendaRepository) -> Self {
        DeleteAgendaBlockUseCase { agenda_repository }
    }

    pub fn execute(&self, id: i64) -> Result<(), String> {
        // Check if block exists
        self.agenda_repository.find_by_id(id)?
            .ok_or_else(|| format!("Agenda block with id {} not found", id))?;

        self.agenda_repository.delete(id)?;
        Ok(())
    }
}

