use crate::application::dtos::{CollectionDto, CreateCollectionCommand, UpdateCollectionCommand, AddBooksToCollectionCommand};
use crate::application::use_cases::collections::{CreateCollectionUseCase, ListCollectionsUseCase, UpdateCollectionUseCase, DeleteCollectionUseCase, AddBooksToCollectionUseCase, RemoveBookFromCollectionUseCase};
use crate::infrastructure::repositories::{SqliteCollectionRepository, SqliteBookRepository};
use crate::adapters::tauri::AppState;

/// Tauri command: Create a new collection
#[tauri::command]
pub fn create_collection(
    command: CreateCollectionCommand,
    state: tauri::State<AppState>,
) -> Result<CollectionDto, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteCollectionRepository::new(sqlite_conn);
    
    let use_case = CreateCollectionUseCase::new(&repository);
    use_case.execute(command)
}

/// Tauri command: List all collections, optionally filtered by book
#[tauri::command]
pub fn list_collections(
    book_id: Option<i64>,
    state: tauri::State<AppState>,
) -> Result<Vec<CollectionDto>, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteCollectionRepository::new(sqlite_conn);
    
    let use_case = ListCollectionsUseCase::new(&repository);
    use_case.execute(book_id)
}

/// Tauri command: Update a collection
#[tauri::command]
pub fn update_collection(
    command: UpdateCollectionCommand,
    state: tauri::State<AppState>,
) -> Result<CollectionDto, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteCollectionRepository::new(sqlite_conn);
    
    let use_case = UpdateCollectionUseCase::new(&repository);
    use_case.execute(command)
}

/// Tauri command: Delete a collection by ID
#[tauri::command]
pub fn delete_collection(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<(), String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteCollectionRepository::new(sqlite_conn);
    
    let use_case = DeleteCollectionUseCase::new(&repository);
    use_case.execute(id)
}

/// Tauri command: Add books to a collection
#[tauri::command]
pub fn add_books_to_collection(
    command: AddBooksToCollectionCommand,
    state: tauri::State<AppState>,
) -> Result<(), String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let collection_repo = SqliteCollectionRepository::new(sqlite_conn.clone());
    let book_repo = SqliteBookRepository::new(sqlite_conn);
    
    let use_case = AddBooksToCollectionUseCase::new(&collection_repo, &book_repo);
    use_case.execute(command.collection_id, command.book_ids)
}

/// Tauri command: Remove a book from a collection
#[tauri::command]
pub fn remove_book_from_collection(
    book_id: i64,
    collection_id: i64,
    state: tauri::State<AppState>,
) -> Result<(), String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteCollectionRepository::new(sqlite_conn);
    
    let use_case = RemoveBookFromCollectionUseCase::new(&repository);
    use_case.execute(book_id, collection_id)
}

