use crate::app::dtos::agenda_block_dto::{
    CreateAgendaBlockCommand, UpdateAgendaBlockCommand, MarkBlockCompletedCommand, AgendaBlockDto,
    ListAgendaBlocksFilters,
};

/// Primary interface for agenda service operations
pub trait AgendaService: Send + Sync {
    fn create(&self, command: CreateAgendaBlockCommand) -> Result<AgendaBlockDto, String>;
    fn update(&self, command: UpdateAgendaBlockCommand) -> Result<AgendaBlockDto, String>;
    fn delete(&self, id: i64) -> Result<(), String>;
    fn get(&self, id: i64) -> Result<AgendaBlockDto, String>;
    fn list(&self, filters: ListAgendaBlocksFilters) -> Result<Vec<AgendaBlockDto>, String>;
    fn mark_completed(&self, command: MarkBlockCompletedCommand) -> Result<AgendaBlockDto, String>;
}

