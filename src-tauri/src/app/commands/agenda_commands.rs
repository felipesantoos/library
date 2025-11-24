use crate::app::dtos::agenda_block_dto::{
    AgendaBlockDto, CreateAgendaBlockCommand, MarkBlockCompletedCommand, UpdateAgendaBlockCommand,
    ListAgendaBlocksFilters,
};
use crate::app::state::AppState;
use crate::core::interfaces::primary::AgendaService;

/// Tauri command: Create a new agenda block
#[tauri::command]
pub fn create_agenda_block(
    command: CreateAgendaBlockCommand,
    state: tauri::State<AppState>,
) -> Result<AgendaBlockDto, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.agenda_service().create(command)
}

/// Tauri command: Update an agenda block
#[tauri::command]
pub fn update_agenda_block(
    command: UpdateAgendaBlockCommand,
    state: tauri::State<AppState>,
) -> Result<AgendaBlockDto, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.agenda_service().update(command)
}

/// Tauri command: Delete an agenda block by ID
#[tauri::command]
pub fn delete_agenda_block(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<(), String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.agenda_service().delete(id)
}

/// Tauri command: Get an agenda block by ID
#[tauri::command]
pub fn get_agenda_block(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<AgendaBlockDto, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.agenda_service().get(id)
}

/// Tauri command: List agenda blocks with optional filters
#[tauri::command]
pub fn list_agenda_blocks(
    filters: Option<ListAgendaBlocksFilters>,
    state: tauri::State<AppState>,
) -> Result<Vec<AgendaBlockDto>, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.agenda_service().list(filters.unwrap_or_default())
}

/// Tauri command: Mark an agenda block as completed and link it to a session
#[tauri::command]
pub fn mark_agenda_block_completed(
    command: MarkBlockCompletedCommand,
    state: tauri::State<AppState>,
) -> Result<AgendaBlockDto, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.agenda_service().mark_completed(command)
}
