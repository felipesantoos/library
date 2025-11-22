use crate::application::dtos::{BookDto, CreateBookCommand, UpdateBookCommand, BookSummaryDto};
use crate::application::use_cases::books::{CreateBookUseCase, GetBookUseCase, ListBooksUseCase, UpdateBookUseCase, DeleteBookUseCase, GenerateBookSummaryUseCase};
use crate::infrastructure::repositories::{SqliteBookRepository, SqliteNoteRepository};
use crate::adapters::tauri::AppState;
use serde::Deserialize;

/// Tauri command: Create a new book
#[tauri::command]
pub fn create_book(
    command: CreateBookCommand,
    state: tauri::State<AppState>,
) -> Result<BookDto, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteBookRepository::new(sqlite_conn);
    
    let use_case = CreateBookUseCase::new(&repository);
    use_case.execute(command)
}

/// Tauri command: Get a book by ID
#[tauri::command]
pub fn get_book(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<BookDto, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteBookRepository::new(sqlite_conn);
    
    let use_case = GetBookUseCase::new(&repository);
    use_case.execute(id)
}

/// Filters for listing books
#[derive(Debug, Deserialize)]
pub struct ListBooksFilters {
    pub status: Option<String>,
    pub book_type: Option<String>,
    #[serde(default)]
    pub is_archived: Option<bool>,
    #[serde(default)]
    pub is_wishlist: Option<bool>,
}

/// Tauri command: List all books with optional filters
#[tauri::command]
pub fn list_books(
    filters: Option<ListBooksFilters>,
    state: tauri::State<AppState>,
) -> Result<Vec<BookDto>, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteBookRepository::new(sqlite_conn);
    
    let use_case = ListBooksUseCase::new(&repository);
    
    if let Some(f) = filters {
        use_case.execute(f.status, f.book_type, f.is_archived, f.is_wishlist)
    } else {
        use_case.execute(None, None, None, None)
    }
}

/// Tauri command: Update an existing book
#[tauri::command]
pub fn update_book(
    command: UpdateBookCommand,
    state: tauri::State<AppState>,
) -> Result<BookDto, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteBookRepository::new(sqlite_conn);
    
    let use_case = UpdateBookUseCase::new(&repository);
    use_case.execute(command)
}

/// Tauri command: Delete a book by ID
#[tauri::command]
pub fn delete_book(
    id: i64,
    state: tauri::State<AppState>,
) -> Result<(), String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    let repository = SqliteBookRepository::new(sqlite_conn);
    
    let use_case = DeleteBookUseCase::new(&repository);
    use_case.execute(id)
}

/// Tauri command: Generate automatic book summary from notes and highlights
#[tauri::command]
pub fn generate_book_summary(
    book_id: i64,
    state: tauri::State<AppState>,
) -> Result<BookSummaryDto, String> {
    let db_conn = state.db_connection.lock().map_err(|e| format!("Lock error: {}", e))?;
    let sqlite_conn = db_conn.get_connection();
    
    let book_repository = SqliteBookRepository::new(sqlite_conn.clone());
    let note_repository = SqliteNoteRepository::new(sqlite_conn);
    
    let use_case = GenerateBookSummaryUseCase::new(&book_repository, &note_repository);
    let summary = use_case.execute(book_id)?;
    
    Ok(summary.into())
}

