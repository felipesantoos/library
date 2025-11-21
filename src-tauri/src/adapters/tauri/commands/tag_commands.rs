use crate::application::dtos::{TagDto, CreateTagCommand, AddTagsToBookCommand};
use crate::application::use_cases::tags::{CreateTagUseCase, ListTagsUseCase, DeleteTagUseCase, AddTagsToBookUseCase, RemoveTagFromBookUseCase};
use crate::infrastructure::repositories::{SqliteTagRepository, SqliteBookRepository};
use crate::adapters::tauri::AppState;

/// Tauri command: Create a new tag
#[tauri::command]
pub fn create_tag(
    command: CreateTagCommand,
    state: tauri::State<AppState>,
) -> Result<TagDto, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteTagRepository::new(sqlite_conn);
    
    let use_case = CreateTagUseCase::new(&repository);
    use_case.execute(command)
}

/// Tauri command: List all tags, optionally filtered by book
#[tauri::command]
pub fn list_tags(
    book_id: Option<i64>,
    state: tauri::State<AppState>,
) -> Result<Vec<TagDto>, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteTagRepository::new(sqlite_conn);
    
    let use_case = ListTagsUseCase::new(&repository);
    use_case.execute(book_id)
}

/// Tauri command: Delete a tag by ID
#[tauri::command]
pub fn delete_tag(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<(), String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteTagRepository::new(sqlite_conn);
    
    let use_case = DeleteTagUseCase::new(&repository);
    use_case.execute(id)
}

/// Tauri command: Add tags to a book
#[tauri::command]
pub fn add_tags_to_book(
    command: AddTagsToBookCommand,
    state: tauri::State<AppState>,
) -> Result<(), String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let tag_repo = SqliteTagRepository::new(sqlite_conn.clone());
    let book_repo = SqliteBookRepository::new(sqlite_conn);
    
    let use_case = AddTagsToBookUseCase::new(&tag_repo, &book_repo);
    use_case.execute(command.book_id, command.tag_ids)
}

/// Tauri command: Remove a tag from a book
#[tauri::command]
pub fn remove_tag_from_book(
    book_id: i64,
    tag_id: i64,
    state: tauri::State<AppState>,
) -> Result<(), String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteTagRepository::new(sqlite_conn);
    
    let use_case = RemoveTagFromBookUseCase::new(&repository);
    use_case.execute(book_id, tag_id)
}

