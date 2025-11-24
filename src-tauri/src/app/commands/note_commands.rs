use crate::app::dtos::{NoteDto, CreateNoteCommand, UpdateNoteCommand, ListNotesFilters};
use crate::app::state::AppState;
use crate::core::interfaces::primary::NoteService;

/// Tauri command: Create a new note
#[tauri::command]
pub fn create_note(
    command: CreateNoteCommand,
    state: tauri::State<AppState>,
) -> Result<NoteDto, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.note_service().create(command)
}

/// Tauri command: Get a note by ID
#[tauri::command]
pub fn get_note(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<NoteDto, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.note_service().get(id)
}

/// Tauri command: List all notes with optional filters
#[tauri::command]
pub fn list_notes(
    filters: Option<ListNotesFilters>,
    state: tauri::State<AppState>,
) -> Result<Vec<NoteDto>, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.note_service().list(filters.unwrap_or_default())
}

/// Tauri command: Update an existing note
#[tauri::command]
pub fn update_note(
    command: UpdateNoteCommand,
    state: tauri::State<AppState>,
) -> Result<NoteDto, String> {
    eprintln!("[update_note command] Received command: id={}, page={:?}, content={:?}", 
              command.id, command.page, command.content);
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.note_service().update(command)
}

/// Tauri command: Delete a note by ID
#[tauri::command]
pub fn delete_note(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<(), String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.note_service().delete(id)
}

