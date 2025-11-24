use crate::app::dtos::{SessionDto, CreateSessionCommand, UpdateSessionCommand};
use crate::app::state::AppState;
use crate::core::interfaces::primary::SessionService;

/// Tauri command: Create a new reading session
#[tauri::command]
pub fn create_session(
    command: CreateSessionCommand,
    state: tauri::State<AppState>,
) -> Result<SessionDto, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.session_service().create(command)
}

/// Tauri command: Get a session by ID
#[tauri::command]
pub fn get_session(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<SessionDto, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.session_service().get(id)
}

/// Tauri command: List all sessions with optional filters
#[tauri::command]
pub fn list_sessions(
    book_id: Option<i64>,
    start_date: Option<String>,
    end_date: Option<String>,
    state: tauri::State<AppState>,
) -> Result<Vec<SessionDto>, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.session_service().list(book_id, start_date, end_date)
}

/// Tauri command: Update an existing session
#[tauri::command]
pub fn update_session(
    command: UpdateSessionCommand,
    state: tauri::State<AppState>,
) -> Result<SessionDto, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.session_service().update(command)
}

/// Tauri command: Delete a session by ID
#[tauri::command]
pub fn delete_session(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<(), String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.session_service().delete(id)
}

