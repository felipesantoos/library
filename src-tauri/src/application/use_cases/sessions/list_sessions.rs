use crate::application::dtos::SessionDto;
use crate::ports::repositories::SessionRepository;

/// Use case for listing sessions with filters
pub struct ListSessionsUseCase<'a> {
    session_repository: &'a dyn SessionRepository,
}

impl<'a> ListSessionsUseCase<'a> {
    pub fn new(session_repository: &'a dyn SessionRepository) -> Self {
        ListSessionsUseCase { session_repository }
    }

    pub fn execute(
        &self,
        book_id: Option<i64>,
        start_date: Option<String>,
        end_date: Option<String>,
    ) -> Result<Vec<SessionDto>, String> {
        let sessions = if let Some(b_id) = book_id {
            // Filter by book
            self.session_repository.find_by_book_id(b_id)?
        } else if let (Some(start), Some(end)) = (start_date, end_date) {
            // Filter by date range
            let start_date = chrono::NaiveDate::parse_from_str(&start, "%Y-%m-%d")
                .map_err(|e| format!("Invalid start date: {}", e))?;
            let end_date = chrono::NaiveDate::parse_from_str(&end, "%Y-%m-%d")
                .map_err(|e| format!("Invalid end date: {}", e))?;
            self.session_repository.find_by_date_range(start_date, end_date)?
        } else {
            // Get all sessions
            self.session_repository.find_all()?
        };

        Ok(sessions.into_iter().map(SessionDto::from).collect())
    }
}

