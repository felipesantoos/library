use crate::app::dtos::reading_dto::{CreateReadingCommand, ReadingDto};
use crate::app::state::AppState;
use crate::core::interfaces::primary::ReadingService;

/// Tauri command: Create a new reading cycle (start reread)
#[tauri::command]
pub fn create_reading(
    command: CreateReadingCommand,
    state: tauri::State<AppState>,
) -> Result<ReadingDto, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.reading_service().create(command)
}

/// Tauri command: Get all reading cycles for a book
#[tauri::command]
pub fn list_readings(
    book_id: i64,
    state: tauri::State<AppState>,
) -> Result<Vec<ReadingDto>, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.reading_service().list(Some(book_id))
}

/// Tauri command: Get a reading by ID
#[tauri::command]
pub fn get_reading(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<ReadingDto, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.reading_service().get(id)
}

/// Tauri command: Get current active reading for a book
#[tauri::command]
pub fn get_current_reading(
    book_id: i64,
    state: tauri::State<AppState>,
) -> Result<Option<ReadingDto>, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.reading_service().get_current(book_id)
}

