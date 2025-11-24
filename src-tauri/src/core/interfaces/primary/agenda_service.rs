use crate::app::dtos::agenda_block_dto::{
    CreateAgendaBlockCommand, UpdateAgendaBlockCommand, MarkBlockCompletedCommand, AgendaBlockDto,
};

/// Primary interface for agenda service operations
pub trait AgendaService: Send + Sync {
    fn create(&self, command: CreateAgendaBlockCommand) -> Result<AgendaBlockDto, String>;
    fn update(&self, command: UpdateAgendaBlockCommand) -> Result<AgendaBlockDto, String>;
    fn delete(&self, id: i64) -> Result<(), String>;
    fn get(&self, id: i64) -> Result<AgendaBlockDto, String>;
    fn list(
        &self,
        book_id: Option<i64>,
        start_date: Option<String>,
        end_date: Option<String>,
        is_completed: Option<bool>,
    ) -> Result<Vec<AgendaBlockDto>, String>;
    fn mark_completed(&self, command: MarkBlockCompletedCommand) -> Result<AgendaBlockDto, String>;
}

