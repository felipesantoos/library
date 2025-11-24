use crate::app::dtos::{TagDto, CreateTagCommand, AddTagsToBookCommand, ListTagsFilters};
use crate::app::state::AppState;
use crate::core::interfaces::primary::TagService;

/// Tauri command: Create a new tag
#[tauri::command]
pub fn create_tag(
    command: CreateTagCommand,
    state: tauri::State<AppState>,
) -> Result<TagDto, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.tag_service().create(command)
}

/// Tauri command: List all tags, optionally filtered by book
#[tauri::command]
pub fn list_tags(
    filters: Option<ListTagsFilters>,
    state: tauri::State<AppState>,
) -> Result<Vec<TagDto>, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.tag_service().list(filters.unwrap_or_default())
}

/// Tauri command: Delete a tag by ID
#[tauri::command]
pub fn delete_tag(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<(), String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.tag_service().delete(id)
}

/// Tauri command: Add tags to a book
#[tauri::command]
pub fn add_tags_to_book(
    command: AddTagsToBookCommand,
    state: tauri::State<AppState>,
) -> Result<(), String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.tag_service().add_to_book(command)
}

/// Tauri command: Remove a tag from a book
#[tauri::command]
pub fn remove_tag_from_book(
    book_id: i64,
    tag_id: i64,
    state: tauri::State<AppState>,
) -> Result<(), String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.tag_service().remove_from_book(book_id, tag_id)
}

