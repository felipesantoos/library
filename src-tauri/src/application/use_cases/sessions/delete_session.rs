use crate::ports::repositories::SessionRepository;

/// Use case for deleting a session
pub struct DeleteSessionUseCase<'a> {
    session_repository: &'a dyn SessionRepository,
}

impl<'a> DeleteSessionUseCase<'a> {
    pub fn new(session_repository: &'a dyn SessionRepository) -> Self {
        DeleteSessionUseCase { session_repository }
    }

    pub fn execute(&self, id: i64) -> Result<(), String> {
        // Check if session exists
        self.session_repository
            .find_by_id(id)?
            .ok_or_else(|| format!("Session with id {} not found", id))?;

        // Delete via repository
        self.session_repository.delete(id)?;

        Ok(())
    }
}

