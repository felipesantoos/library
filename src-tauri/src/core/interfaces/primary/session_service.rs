use crate::app::dtos::session_dto::{SessionDto, CreateSessionCommand, UpdateSessionCommand};

/// Primary interface for session service operations
pub trait SessionService: Send + Sync {
    fn create(&self, command: CreateSessionCommand) -> Result<SessionDto, String>;
    fn update(&self, command: UpdateSessionCommand) -> Result<SessionDto, String>;
    fn delete(&self, id: i64) -> Result<(), String>;
    fn get(&self, id: i64) -> Result<SessionDto, String>;
    fn list(
        &self,
        book_id: Option<i64>,
        start_date: Option<String>,
        end_date: Option<String>,
    ) -> Result<Vec<SessionDto>, String>;
}

