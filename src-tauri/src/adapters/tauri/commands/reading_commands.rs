use crate::application::dtos::reading_dto::{CreateReadingCommand, ReadingDto};
use crate::application::use_cases::readings::{
    CreateReadingUseCase, ListReadingsUseCase, GetReadingUseCase, GetCurrentReadingUseCase,
};
use crate::infrastructure::repositories::{SqliteReadingRepository, SqliteBookRepository};
use crate::adapters::tauri::AppState;

/// Tauri command: Create a new reading cycle (start reread)
#[tauri::command]
pub fn create_reading(
    command: CreateReadingCommand,
    state: tauri::State<AppState>,
) -> Result<ReadingDto, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    
    let reading_repo = SqliteReadingRepository::new(sqlite_conn.clone());
    let book_repo = SqliteBookRepository::new(sqlite_conn);
    
    let use_case = CreateReadingUseCase::new(&reading_repo, &book_repo);
    use_case.execute(command)
}

/// Tauri command: Get all reading cycles for a book
#[tauri::command]
pub fn list_readings(
    book_id: i64,
    state: tauri::State<AppState>,
) -> Result<Vec<ReadingDto>, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteReadingRepository::new(sqlite_conn);
    
    let use_case = ListReadingsUseCase::new(&repository);
    use_case.execute(book_id)
}

/// Tauri command: Get a reading by ID
#[tauri::command]
pub fn get_reading(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<ReadingDto, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteReadingRepository::new(sqlite_conn);
    
    let use_case = GetReadingUseCase::new(&repository);
    use_case.execute(id)
}

/// Tauri command: Get current active reading for a book
#[tauri::command]
pub fn get_current_reading(
    book_id: i64,
    state: tauri::State<AppState>,
) -> Result<Option<ReadingDto>, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteReadingRepository::new(sqlite_conn);
    
    let use_case = GetCurrentReadingUseCase::new(&repository);
    use_case.execute(book_id)
}

