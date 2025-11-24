use crate::app::dtos::session_dto::{SessionDto, CreateSessionCommand, UpdateSessionCommand, ListSessionsFilters};

/// Primary interface for session service operations
pub trait SessionService: Send + Sync {
    fn create(&self, command: CreateSessionCommand) -> Result<SessionDto, String>;
    fn update(&self, command: UpdateSessionCommand) -> Result<SessionDto, String>;
    fn delete(&self, id: i64) -> Result<(), String>;
    fn get(&self, id: i64) -> Result<SessionDto, String>;
    fn list(&self, filters: ListSessionsFilters) -> Result<Vec<SessionDto>, String>;
}

