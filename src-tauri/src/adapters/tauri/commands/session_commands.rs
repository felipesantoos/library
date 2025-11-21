use crate::application::dtos::{SessionDto, CreateSessionCommand, UpdateSessionCommand};
use crate::application::use_cases::sessions::{CreateSessionUseCase, GetSessionUseCase, ListSessionsUseCase, UpdateSessionUseCase, DeleteSessionUseCase};
use crate::infrastructure::repositories::{SqliteSessionRepository, SqliteBookRepository};
use crate::adapters::tauri::AppState;

/// Tauri command: Create a new reading session
#[tauri::command]
pub fn create_session(
    command: CreateSessionCommand,
    state: tauri::State<AppState>,
) -> Result<SessionDto, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let session_repository = SqliteSessionRepository::new(sqlite_conn.clone());
    let book_repository = SqliteBookRepository::new(sqlite_conn);
    
    let use_case = CreateSessionUseCase::new(&session_repository, &book_repository);
    use_case.execute(command)
}

/// Tauri command: Get a session by ID
#[tauri::command]
pub fn get_session(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<SessionDto, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteSessionRepository::new(sqlite_conn);
    
    let use_case = GetSessionUseCase::new(&repository);
    use_case.execute(id)
}

/// Tauri command: List all sessions with optional filters
#[tauri::command]
pub fn list_sessions(
    book_id: Option<i64>,
    start_date: Option<String>,
    end_date: Option<String>,
    state: tauri::State<AppState>,
) -> Result<Vec<SessionDto>, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteSessionRepository::new(sqlite_conn);
    
    let use_case = ListSessionsUseCase::new(&repository);
    use_case.execute(book_id, start_date, end_date)
}

/// Tauri command: Update an existing session
#[tauri::command]
pub fn update_session(
    command: UpdateSessionCommand,
    state: tauri::State<AppState>,
) -> Result<SessionDto, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let session_repository = SqliteSessionRepository::new(sqlite_conn.clone());
    let book_repository = SqliteBookRepository::new(sqlite_conn);
    
    let use_case = UpdateSessionUseCase::new(&session_repository, &book_repository);
    use_case.execute(command)
}

/// Tauri command: Delete a session by ID
#[tauri::command]
pub fn delete_session(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<(), String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteSessionRepository::new(sqlite_conn);
    
    let use_case = DeleteSessionUseCase::new(&repository);
    use_case.execute(id)
}

