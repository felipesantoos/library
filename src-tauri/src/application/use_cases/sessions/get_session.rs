use crate::application::dtos::SessionDto;
use crate::ports::repositories::SessionRepository;

/// Use case for getting a session by ID
pub struct GetSessionUseCase<'a> {
    session_repository: &'a dyn SessionRepository,
}

impl<'a> GetSessionUseCase<'a> {
    pub fn new(session_repository: &'a dyn SessionRepository) -> Self {
        GetSessionUseCase { session_repository }
    }

    pub fn execute(&self, id: i64) -> Result<SessionDto, String> {
        let session = self.session_repository
            .find_by_id(id)?
            .ok_or_else(|| format!("Session with id {} not found", id))?;

        Ok(SessionDto::from(session))
    }
}

