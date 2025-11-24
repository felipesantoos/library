use crate::app::dtos::{CollectionDto, CreateCollectionCommand, UpdateCollectionCommand, AddBooksToCollectionCommand, ListCollectionsFilters};
use crate::app::state::AppState;
use crate::core::interfaces::primary::CollectionService;

/// Tauri command: Create a new collection
#[tauri::command]
pub fn create_collection(
    command: CreateCollectionCommand,
    state: tauri::State<AppState>,
) -> Result<CollectionDto, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.collection_service().create(command)
}

/// Tauri command: List all collections, optionally filtered by book
#[tauri::command]
pub fn list_collections(
    filters: Option<ListCollectionsFilters>,
    state: tauri::State<AppState>,
) -> Result<Vec<CollectionDto>, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.collection_service().list(filters.unwrap_or_default())
}

/// Tauri command: Update a collection
#[tauri::command]
pub fn update_collection(
    command: UpdateCollectionCommand,
    state: tauri::State<AppState>,
) -> Result<CollectionDto, String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.collection_service().update(command)
}

/// Tauri command: Delete a collection by ID
#[tauri::command]
pub fn delete_collection(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<(), String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.collection_service().delete(id)
}

/// Tauri command: Add books to a collection
#[tauri::command]
pub fn add_books_to_collection(
    command: AddBooksToCollectionCommand,
    state: tauri::State<AppState>,
) -> Result<(), String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.collection_service().add_books(command)
}

/// Tauri command: Remove a book from a collection
#[tauri::command]
pub fn remove_book_from_collection(
    book_id: i64,
    collection_id: i64,
    state: tauri::State<AppState>,
) -> Result<(), String> {
    let container = state.container.lock().map_err(|e| format!("DI lock error: {}", e))?;
    container.collection_service().remove_book(collection_id, book_id)
}

