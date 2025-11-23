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
        let sessions = match (book_id, start_date, end_date) {
            // Filter by book AND date range
            (Some(b_id), Some(start), Some(end)) => {
                let start_date = chrono::NaiveDate::parse_from_str(&start, "%Y-%m-%d")
                    .map_err(|e| format!("Invalid start date: {}", e))?;
                let end_date = chrono::NaiveDate::parse_from_str(&end, "%Y-%m-%d")
                    .map_err(|e| format!("Invalid end date: {}", e))?;
                self.session_repository.find_by_book_id_and_date_range(b_id, start_date, end_date)?
            }
            // Filter by book only
            (Some(b_id), _, _) => {
                self.session_repository.find_by_book_id(b_id)?
            }
            // Filter by date range only
            (None, Some(start), Some(end)) => {
                let start_date = chrono::NaiveDate::parse_from_str(&start, "%Y-%m-%d")
                    .map_err(|e| format!("Invalid start date: {}", e))?;
                let end_date = chrono::NaiveDate::parse_from_str(&end, "%Y-%m-%d")
                    .map_err(|e| format!("Invalid end date: {}", e))?;
                self.session_repository.find_by_date_range(start_date, end_date)?
            }
            // Get all sessions
            _ => {
                self.session_repository.find_all()?
            }
        };

        Ok(sessions.into_iter().map(SessionDto::from).collect())
    }
}

