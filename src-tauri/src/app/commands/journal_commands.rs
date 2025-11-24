use crate::app::dtos::journal_entry_dto::{
    CreateJournalEntryCommand, UpdateJournalEntryCommand, JournalEntryDto,
};
use crate::app::state::AppState;
use crate::core::interfaces::primary::JournalService;

/// Tauri command: Create a new journal entry
#[tauri::command]
pub fn create_journal_entry(
    command: CreateJournalEntryCommand,
    state: tauri::State<AppState>,
) -> Result<JournalEntryDto, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.journal_service().create(command)
}

/// Tauri command: Update a journal entry
#[tauri::command]
pub fn update_journal_entry(
    command: UpdateJournalEntryCommand,
    state: tauri::State<AppState>,
) -> Result<JournalEntryDto, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.journal_service().update(command)
}

/// Tauri command: Delete a journal entry by ID
#[tauri::command]
pub fn delete_journal_entry(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<(), String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.journal_service().delete(id)
}

/// Tauri command: Get a journal entry by ID
#[tauri::command]
pub fn get_journal_entry(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<JournalEntryDto, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.journal_service().get(id)
}

/// Tauri command: List journal entries with optional filters
#[tauri::command]
pub fn list_journal_entries(
    book_id: Option<i64>,
    start_date: Option<String>,
    end_date: Option<String>,
    state: tauri::State<AppState>,
) -> Result<Vec<JournalEntryDto>, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.journal_service().list(start_date, end_date, book_id)
}

