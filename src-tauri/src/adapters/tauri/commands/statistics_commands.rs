use crate::application::dtos::statistics_dto::StatisticsDto;
use crate::application::use_cases::statistics::GetStatisticsUseCase;
use crate::infrastructure::repositories::{SqliteSessionRepository, SqliteBookRepository};
use crate::adapters::tauri::AppState;

/// Tauri command: Get statistics
#[tauri::command]
pub fn get_statistics(
    state: tauri::State<AppState>,
) -> Result<StatisticsDto, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let session_repository = SqliteSessionRepository::new(sqlite_conn.clone());
    let book_repository = SqliteBookRepository::new(sqlite_conn);
    
    let use_case = GetStatisticsUseCase::new(&session_repository, &book_repository);
    use_case.execute()
}

